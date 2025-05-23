import { babelTransformExpression } from '@/helpers/babel-transform';
import { capitalize } from '@/helpers/capitalize';
import { isMorphoNode } from '@/helpers/is-morpho-node';
import { createCodeProcessorPlugin } from '@/helpers/plugins/process-code';
import { replaceNodes } from '@/helpers/replace-identifiers';
import {
  MorphoComponent,
  MorphoState,
  StateValue,
  TargetBlockDefinition,
} from '@/types/morpho-component';
import { NodePath, types } from '@babel/core';
import {
  BlockStatement,
  Expression,
  Identifier,
  Node,
  ObjectExpression,
  ObjectMethod,
  ObjectProperty,
  assignmentExpression,
  functionExpression,
  identifier,
  isArrowFunctionExpression,
  isDeclaration,
  isFunctionDeclaration,
  isFunctionExpression,
  isIdentifier,
  isMemberExpression,
  isObjectMethod,
  isObjectProperty,
  isOptionalMemberExpression,
  isPrivateName,
  isSpreadElement,
  isStringLiteral,
  isTSAsExpression,
  isTSInterfaceBody,
  isTSType,
  memberExpression,
  objectMethod,
} from '@babel/types';
import { MorphoNode } from '@builder.io/morpho';
import { pipe } from 'fp-ts/lib/function';
import traverse from 'neotraverse/legacy';
import { parseCode, uncapitalize } from './helpers';

function mapStateIdentifiersInExpression(expression: string, stateProperties: string[]) {
  const setExpressions = stateProperties.map((propertyName) => `set${capitalize(propertyName)}`);

  return pipe(
    babelTransformExpression(expression, {
      Identifier(path) {
        if (stateProperties.includes(path.node.name)) {
          if (
            // ignore member expressions, as the `stateProperty` is going to be at the module scope.
            !(isMemberExpression(path.parent) && path.parent.property === path.node) &&
            !(isOptionalMemberExpression(path.parent) && path.parent.property === path.node) &&
            // ignore declarations of that state property, e.g. `function foo() {}`
            !isDeclaration(path.parent) &&
            !isFunctionDeclaration(path.parent) &&
            !(isFunctionExpression(path.parent) && path.parent.id === path.node) &&
            // ignore object keys
            !(isObjectProperty(path.parent) && path.parent.key === path.node)
          ) {
            let hasTypeParent = false;
            path.findParent((parent: NodePath) => {
              if (isTSType(parent as Node) || isTSInterfaceBody(parent as Node)) {
                hasTypeParent = true;
                return true;
              }
              return false;
            });

            if (hasTypeParent) {
              return;
            }

            const newExpression = memberExpression(identifier('state'), identifier(path.node.name));
            try {
              path.replaceWith(newExpression);
            } catch (err) {
              console.error(err);

              // console.log('err: ', {
              //   from: generate(path.parent).code,
              //   fromChild: generate(path.node).code,
              //   to: newExpression,
              //   // err,
              // });
            }
          }
        }
      },
      CallExpression(path) {
        if (isIdentifier(path.node.callee)) {
          if (setExpressions.includes(path.node.callee.name)) {
            // setFoo -> foo
            const statePropertyName = uncapitalize(path.node.callee.name.slice(3));

            // setFoo(...) -> state.foo = ...
            path.replaceWith(
              assignmentExpression(
                '=',
                identifier(`state.${statePropertyName}`),
                path.node.arguments[0] as any,
              ),
            );
          }
        }
      },
    }),
    (code) => code.trim(),
  );
}

const consolidateClassBindings = (item: MorphoNode) => {
  if (item.bindings.className) {
    if (item.bindings.class) {
      // TO-DO: it's too much work to merge 2 bindings, so just remove the old one for now.
      item.bindings.class = item.bindings.className;
    } else {
      item.bindings.class = item.bindings.className;
    }
    delete item.bindings.className;
  }

  if (item.properties.className) {
    if (item.properties.class) {
      item.properties.class = `${item.properties.class} ${item.properties.className}`;
    } else {
      item.properties.class = item.properties.className;
    }
    delete item.properties.className;
  }

  if (item.properties.class && item.bindings.class) {
    console.warn(`[${item.name}]: Ended up with both a property and binding for 'class'.`);
  }
};

/**
 * Convert state identifiers from React hooks format to the state.* format Morpho needs
 * e.g.
 *   text -> state.text
 *   setText(...) -> state.text = ...
 *
 * This also applies to components that use both useState and useStore.
 * e.g.
 * const [foo, setFoo] = useState(1)
 * const store = useStore({
 *   bar() { return foo } // becomes bar() { return state.foo }
 * })`
 */
export function mapStateIdentifiers(json: MorphoComponent, stateProperties: string[]) {
  const plugin = createCodeProcessorPlugin(
    () => (code) => mapStateIdentifiersInExpression(code, stateProperties),
  );

  plugin(json);

  for (const key in json.targetBlocks) {
    const targetBlock = json.targetBlocks[key];
    for (const targetBlockKey of Object.keys(targetBlock)) {
      const block = targetBlock[targetBlockKey as keyof TargetBlockDefinition];
      if (block && 'code' in block) {
        block.code = mapStateIdentifiersInExpression(block.code, stateProperties);
      }
    }
  }

  traverse(json).forEach(function (item) {
    // only consolidate bindings for HTML tags, not custom components
    // custom components are always PascalCase, e.g. MyComponent
    // but HTML tags are lowercase, e.g. div
    if (isMorphoNode(item) && item.name.toLowerCase() === item.name) {
      consolidateClassBindings(item);
    }
  });
}

/**
 * Replaces `this.` with `state.` and trims code
 * @param code origin code
 */
const getCleanedStateCode = (code: string): string => {
  return replaceNodes({
    code,
    nodeMaps: [
      {
        from: types.thisExpression(),
        to: types.identifier('state'),
      },
    ],
  }).trim();
};

const processStateObjectSlice = (item: ObjectMethod | ObjectProperty): StateValue => {
  if (isObjectProperty(item)) {
    if (isFunctionExpression(item.value)) {
      return {
        code: getCleanedStateCode(parseCode(item.value)),
        type: 'function',
      };
    } else if (isArrowFunctionExpression(item.value)) {
      /**
       * Arrow functions are normally converted to object methods to work around
       * limitations with arrow functions in state in frameworks such as Svelte.
       * However, this conversion does not work for async arrow functions due to
       * how we handle parsing in `handleErrorOrExpression` for parsing
       * expressions. That code does not detect async functions in order to apply
       * its parsing workarounds. Even if it did, it does not consider async code
       * when prefixing with "function". This would result in "function async foo()"
       * which is not a valid function expression definition.
       */
      // TODO ENG-7256 Find a way to do this without diverging code path
      if (item.value.async) {
        const func = functionExpression(
          item.key as Identifier,
          item.value.params,
          item.value.body as BlockStatement,
          false,
          true,
        );

        return {
          code: parseCode(func).trim(),
          type: 'function',
        };
      }
      const n = objectMethod(
        'method',
        item.key as Expression,
        item.value.params,
        item.value.body as BlockStatement,
      );
      // Replace this. with state. to handle following
      // const state = useStore({ _do: () => {this._active = !!id;}})
      const code = getCleanedStateCode(parseCode(n));
      return {
        code: code,
        type: 'method',
      };
    } else {
      // Remove typescript types, e.g. from
      // { foo: ('string' as SomeType) }
      if (isTSAsExpression(item.value)) {
        return {
          code: getCleanedStateCode(parseCode(item.value.expression)),
          type: 'property',
          propertyType: 'normal',
        };
      }
      return {
        code: getCleanedStateCode(parseCode(item.value)),
        type: 'property',
        propertyType: 'normal',
      };
    }
  } else if (isObjectMethod(item)) {
    // TODO ENG-7256 Find a way to do this without diverging code path
    if (item.async) {
      const func = functionExpression(
        item.key as Identifier,
        item.params,
        item.body as BlockStatement,
        false,
        true,
      );

      return {
        code: parseCode(func).trim(),
        type: 'function',
      };
    }

    const method = objectMethod(
      item.kind,
      item.key,
      item.params,
      item.body,
      false,
      false,
      item.async,
    );

    const n = getCleanedStateCode(parseCode({ ...method, returnType: null }));

    const isGetter = item.kind === 'get';

    return {
      code: n,
      type: isGetter ? 'getter' : 'method',
    };
  } else {
    throw new Error('Unexpected state value type', item);
  }
};

const processDefaultPropsSlice = (item: ObjectMethod | ObjectProperty): StateValue => {
  if (isObjectProperty(item)) {
    if (isFunctionExpression(item.value) || isArrowFunctionExpression(item.value)) {
      return {
        code: parseCode(item.value),
        type: 'method',
      };
    } else {
      // Remove typescript types, e.g. from
      // { foo: ('string' as SomeType) }
      if (isTSAsExpression(item.value)) {
        return {
          code: parseCode(item.value.expression),
          type: 'property',
          propertyType: 'normal',
        };
      }
      return {
        code: parseCode(item.value),
        type: 'property',
        propertyType: 'normal',
      };
    }
  } else if (isObjectMethod(item)) {
    const n = parseCode({ ...item, returnType: null });

    const isGetter = item.kind === 'get';

    return {
      code: n,
      type: isGetter ? 'getter' : 'method',
    };
  } else {
    throw new Error('Unexpected state value type', item);
  }
};

export const parseStateObjectToMorphoState = (
  object: ObjectExpression,
  isState: boolean = true, // parse state or defaultProps
): MorphoState => {
  const state: MorphoState = {};
  object.properties.forEach((x) => {
    if (isSpreadElement(x)) {
      throw new Error('Parse Error: Morpho cannot consume spread element in state object: ' + x);
    }

    if (isPrivateName(x.key)) {
      throw new Error('Parse Error: Morpho cannot consume private name in state object: ' + x.key);
    }

    if (!isIdentifier(x.key) && !isStringLiteral(x.key)) {
      throw new Error(
        'Parse Error: Morpho cannot consume non-identifier and non-string key in state object: ' +
          x.key,
      );
    }

    const keyName = isStringLiteral(x.key) ? x.key.value : x.key.name;
    state[keyName] = isState ? processStateObjectSlice(x) : processDefaultPropsSlice(x);
  });

  return state;
};
