import { mapValues } from 'lodash';
import traverse, { TraverseContext } from 'traverse';
import { isMorphoNode } from '../helpers/is-morpho-node';
import { MorphoComponent } from '../types/morpho-component';
import { MorphoNode } from '../types/morpho-node';

export const getRenderOptions = (node: MorphoNode) => {
  return {
    ...mapValues(node.properties, (value) => `"${value}"`),
    ...mapValues(node.bindings, (value) => `{${value}}`),
  };
};

type CompileAwayComponentsOptions = {
  components: {
    [key: string]: (node: MorphoNode, context: TraverseContext) => MorphoNode | void;
  };
};

/**
 * @example
 *    componentToReact(morphoJson, {
 *      plugins: [
 *        compileAwayComponents({
 *          Image: (node) => {
 *             return jsx(`
 *               <div>
 *                 <img src="${node.properties.image}" />
 *               </div>
 *             `);
 *          }
 *        })
 *      ]
 *    })
 */
export const compileAwayComponents =
  (pluginOptions: CompileAwayComponentsOptions) => (options?: any) => ({
    json: {
      pre: (json: MorphoComponent) => {
        traverse(json).forEach(function (item) {
          if (isMorphoNode(item)) {
            const mapper = pluginOptions.components[item.name];
            if (mapper) {
              const result = mapper(item, this);
              if (result) {
                this.update(result);
              }
            }
          }
        });
      },
    },
  });
