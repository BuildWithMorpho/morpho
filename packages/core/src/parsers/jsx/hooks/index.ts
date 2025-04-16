import { HOOKS } from '@/constants/hooks';
import { resolveMetadata } from '@/parsers/jsx/hooks/use-metadata';
import { MorphoComponent } from '@/types/morpho-component';
import * as babel from '@babel/core';
import { NodePath } from '@babel/core';
import generate from '@babel/generator';
import { parseCodeJson } from '../helpers';
import { parseStateObjectToMorphoState } from '../state';
import { Context, ParseMorphoOptions } from '../types';
import { getHook } from './helpers';

const { types } = babel;

export function parseDefaultPropsHook(
  component: MorphoComponent,
  expression: babel.types.CallExpression,
) {
  const firstArg = expression.arguments[0];
  if (types.isObjectExpression(firstArg)) {
    component.defaultProps = parseStateObjectToMorphoState(firstArg, false);
  }
}

export function generateUseStyleCode(expression: babel.types.CallExpression) {
  return generate(expression.arguments[0]).code.replace(/(^("|'|`)|("|'|`)$)/g, '');
}

/**
 * Transform useMetadata({...}) onto the component JSON as
 * meta: { metadataHook: { ... }}
 *
 * This function collects metadata and removes the statement from
 * the returned nodes array
 */
export const collectModuleScopeHooks =
  (context: Context, options: ParseMorphoOptions) => (path: NodePath<babel.types.Program>) => {
    const programNodes = path.node.body;
    return programNodes.filter((node) => {
      const hook = getHook(node);
      if (!hook) {
        return true;
      }
      if (types.isIdentifier(hook.callee)) {
        const metadataHooks = new Set((options.jsonHookNames || []).concat(HOOKS.METADATA));
        const name = hook.callee.name;
        if (metadataHooks.has(name)) {
          const metaDataObjectNode = hook.arguments[0];

          let json: any;
          try {
            json = options.filePath
              ? resolveMetadata({ context, node: metaDataObjectNode, nodePath: path, options })
              : parseCodeJson(metaDataObjectNode);
          } catch (e) {
            // Meta data isn't simple json convert it to ast
            console.error(`Error parsing metadata hook ${name}`);
            throw e;
          }

          context.builder.component.meta[name] = {
            ...((context.builder.component.meta[name] as Object) || {}),
            ...json,
          };
          return false;
        } else if (name === HOOKS.STYLE) {
          context.builder.component.style = generateUseStyleCode(hook);
          return false;
        } else if (name === HOOKS.DEFAULT_PROPS) {
          parseDefaultPropsHook(context.builder.component, hook);
        }
      }

      return true;
    });
  };
