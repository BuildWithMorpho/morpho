import { HOOKS } from '@/constants/hooks';
import { createMorphoComponent } from '@/helpers/create-morpho-component';
import { filterEmptyTextNodes } from '@/helpers/filter-empty-text-nodes';
import { tryParseJson } from '@/helpers/json';
import { stripNewlinesInStrings } from '@/helpers/replace-new-lines-in-strings';
import { getSignalImportName } from '@/helpers/signals';
import { traverseNodes } from '@/helpers/traverse-nodes';
import { MorphoComponent } from '@/types/morpho-component';
import * as babel from '@babel/core';
import generate from '@babel/generator';
import tsPreset from '@babel/preset-typescript';
import { pipe } from 'fp-ts/lib/function';
import { jsonToAst } from './ast';
import { collectTypes, isTypeOrInterface } from './component-types';
import { extractContextComponents } from './context';
import { jsxElementToJson } from './element-parser';
import { generateExports } from './exports';
import { componentFunctionToJson } from './function-parser';
import { babelDefaultTransform, babelStripTypes, isImportOrDefaultExport } from './helpers';
import { collectModuleScopeHooks } from './hooks';
import { getMagicString, getTargetId, getUseTargetStatements } from './hooks/use-target';
import { handleImportDeclaration } from './imports';
import { undoPropsDestructure } from './props';
import { findOptionalProps } from './props-types';
import { findSignals } from './signals';
import { mapStateIdentifiers } from './state';
import { ParseMorphoOptions } from './types';

const { types } = babel;

const typescriptBabelPreset = [tsPreset, { isTSX: true, allExtensions: true }];

const beforeParse = (path: babel.NodePath<babel.types.Program>) => {
  path.traverse({
    FunctionDeclaration(path) {
      undoPropsDestructure(path);
    },
  });
};

/**
 * This function takes the raw string from a Morpho component, and converts it into a JSON that can be processed by
 * each generator function.
 *
 * @param jsx string representation of the Morpho component
 * @returns A JSON representation of the Morpho component
 */
export function parseJsx(
  jsx: string,
  _options: Partial<ParseMorphoOptions> = {},
): MorphoComponent {
  let subComponentFunctions: string[] = [];

  const options: ParseMorphoOptions = {
    typescript: false,
    ..._options,
  };

  const stateToScope: string[] = [];

  const jsxToUse = babelStripTypes(jsx, !options.typescript);

  const output = babelDefaultTransform(jsxToUse, {
    JSXExpressionContainer(path, context) {
      if (types.isJSXEmptyExpression(path.node.expression)) {
        path.remove();
      }
    },
    Program(path, context) {
      if (context.builder) {
        return;
      }

      beforeParse(path);

      context.builder = {
        component: createMorphoComponent(),
      };

      const keepStatements = path.node.body.filter(
        (statement) => isImportOrDefaultExport(statement) || isTypeOrInterface(statement),
      );

      context.builder.component.exports = generateExports(path);

      subComponentFunctions = path.node.body
        .filter(
          (node) => !types.isExportDefaultDeclaration(node) && types.isFunctionDeclaration(node),
        )
        .map((node) => `export default ${generate(node).code!}`);

      const preComponentCode = pipe(
        path,
        collectModuleScopeHooks(context, options),
        types.program,
        generate,
        (generatorResult) => generatorResult.code,
      );

      // TODO: support multiple? e.g. for others to add imports?
      context.builder.component.hooks.preComponent = { code: preComponentCode };

      path.replaceWith(types.program(keepStatements));
    },
    FunctionDeclaration(path, context) {
      const { node } = path;
      if (types.isIdentifier(node.id)) {
        const name = node.id.name;
        if (name[0].toUpperCase() === name[0]) {
          path.traverse({
            /**
             * Plugin to find all `useTarget()` assignment calls inside of the component function body
             * and replace them with a magic string.
             */
            CallExpression(path) {
              if (!types.isCallExpression(path.node)) return;
              if (!types.isIdentifier(path.node.callee)) return;
              if (path.node.callee.name !== HOOKS.TARGET) return;

              const targetBlock = getUseTargetStatements(path);

              if (!targetBlock) return;

              const blockId = getTargetId(context.builder.component);

              // replace the useTarget() call with a magic string
              path.replaceWith(types.stringLiteral(getMagicString(blockId)));

              // store the target block in the component
              context.builder.component.targetBlocks = {
                ...context.builder.component.targetBlocks,
                [blockId]: targetBlock,
              };
            },
          });
          path.replaceWith(
            jsonToAst(componentFunctionToJson(node, context, stateToScope, options)),
          );
        }
      }
    },
    ImportDeclaration(path, context) {
      handleImportDeclaration({ options, path, context });
    },
    ExportDefaultDeclaration(path) {
      path.replaceWith(path.node.declaration);
    },
    JSXElement(path) {
      const { node } = path;
      path.replaceWith(jsonToAst(jsxElementToJson(node, _options)));
    },
    ExportNamedDeclaration(path, context) {
      const { node } = path;
      if (
        babel.types.isTSInterfaceDeclaration(node.declaration) ||
        babel.types.isTSTypeAliasDeclaration(node.declaration)
      ) {
        collectTypes(path, context);
      }
    },
    TSTypeAliasDeclaration(path, context) {
      collectTypes(path, context);
    },
    TSInterfaceDeclaration(path, context) {
      collectTypes(path, context);
    },
  });

  if (!output || !output.code) {
    throw new Error('Could not parse JSX');
  }

  const stringifiedMorphoComponent = stripNewlinesInStrings(
    output.code
      .trim()
      // Occasional issues where comments get kicked to the top. Full fix should strip these sooner
      .replace(/^\/\*[\s\S]*?\*\/\s*/, '')
      // Weird bug with adding a newline in a normal at end of a normal string that can't have one
      // If not one-off find full solve and cause
      .replace(/\n"/g, '"')
      .replace(/^\({/, '{')
      .replace(/}\);$/, '}'),
  );

  const morphoComponent: MorphoComponent = tryParseJson(stringifiedMorphoComponent);

  mapStateIdentifiers(morphoComponent, stateToScope);
  extractContextComponents(morphoComponent);

  morphoComponent.subComponents = subComponentFunctions.map((item) => parseJsx(item, options));

  const signalTypeImportName = getSignalImportName(jsxToUse);

  if (signalTypeImportName) {
    morphoComponent.signals = { signalTypeImportName };
  }

  if (options.tsProject && options.filePath) {
    // identify optional props.
    const optionalProps = findOptionalProps({
      project: options.tsProject.project,
      filePath: options.filePath,
    });

    optionalProps.forEach((prop) => {
      morphoComponent.props = {
        ...morphoComponent.props,
        [prop]: {
          ...morphoComponent.props?.[prop]!,
          optional: true,
        },
      };
    });

    const reactiveValues = findSignals({
      filePath: options.filePath,
      project: options.tsProject.project,
    });

    reactiveValues.props.forEach((prop) => {
      morphoComponent.props = {
        ...morphoComponent.props,
        [prop]: {
          ...morphoComponent.props?.[prop]!,
          propertyType: 'reactive',
        },
      };
    });

    reactiveValues.state.forEach((state) => {
      if (!morphoComponent.state[state]) return;
      morphoComponent.state[state]!.propertyType = 'reactive';
    });

    reactiveValues.context.forEach((context) => {
      if (!morphoComponent.context.get[context]) return;
      morphoComponent.context.get[context].type = 'reactive';
    });
  }

  traverseNodes(morphoComponent, (node) => {
    node.children = node.children.filter(filterEmptyTextNodes);
  });

  return morphoComponent;
}
