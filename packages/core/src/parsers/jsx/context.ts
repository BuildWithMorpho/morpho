import * as babel from '@babel/core';
import traverse from 'traverse';
import { createMorphoNode } from '../../helpers/create-morpho-node';
import { isMorphoNode } from '../../helpers/is-morpho-node';
import { traceReferenceToModulePath } from '../../helpers/trace-reference-to-module-path';
import { MorphoComponent } from '../../types/morpho-component';
import { parseStateObjectToMorphoState } from './state';

const expressionToNode = (str: string) => {
  const code = `export default ${str}`;
  return (
    (babel.parse(code) as babel.types.File).program.body[0] as babel.types.ExportDefaultDeclaration
  ).declaration;
};

/**
 * Convert <Context.Provider /> to hooks formats by mutating the
 * MorphoComponent tree
 */
export function extractContextComponents(json: MorphoComponent) {
  traverse(json).forEach(function (item) {
    if (isMorphoNode(item)) {
      if (item.name.endsWith('.Provider')) {
        const value = item.bindings?.value?.code;
        const name = item.name.split('.')[0];
        const refPath = traceReferenceToModulePath(json.imports, name)!;
        json.context.set[refPath] = {
          name,
          value: value
            ? parseStateObjectToMorphoState(
                expressionToNode(value) as babel.types.ObjectExpression,
              )
            : undefined,
        };

        this.update(
          createMorphoNode({
            name: 'Fragment',
            children: item.children,
          }),
        );
      }
      // TODO: maybe support Context.Consumer:
      // if (item.name.endsWith('.Consumer')) { ... }
    }
  });
}
