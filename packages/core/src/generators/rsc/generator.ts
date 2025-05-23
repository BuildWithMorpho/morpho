import { ToRscOptions } from '@/generators/rsc/types';
import traverse from 'neotraverse/legacy';
import { MorphoPlugin } from '../..';
import { isMorphoNode } from '../../helpers/is-morpho-node';
import { mergeOptions } from '../../helpers/merge-options';
import { checkIsDefined } from '../../helpers/nullable';
import { MorphoComponent } from '../../types/morpho-component';
import { TranspilerGenerator } from '../../types/transpiler';
import { checkIfIsClientComponent } from '../helpers/rsc';
import { componentToReact } from '../react';

/**
 * Transform react to be RSC compatible, such as
 * - remove event listeners
 * - remove lifecycle hooks
 * - remove refs
 * - transform context to prop drilling
 */
const RSC_TRANSFORM_PLUGIN: MorphoPlugin = () => ({
  json: {
    pre: (json: MorphoComponent) => {
      json.hooks.onMount = [];
      delete json.hooks.onUnMount;
      delete json.hooks.onUpdate;
      json.refs = {};

      json.context.get = {};
      json.context.set = {};

      traverse(json).forEach((node) => {
        if (isMorphoNode(node)) {
          const isComponent = node.name.match(/[A-Z]/);
          // if (isComponent) {
          //   // Drill context down, aka
          //   // function (props) { return <Component _context{props._context} /> }
          //   if (!node.bindings[contextPropDrillingKey]) {
          //     node.bindings[contextPropDrillingKey] = createSingleBinding({
          //       code: contextPropDrillingKey,
          //     });
          //   }
          // }
          if (node.bindings.ref) {
            delete node.bindings.ref;
          }
          // for (const key in node.bindings) {
          //   if (key.match(/^on[A-Z]/)) {
          //     delete node.bindings[key];
          //   }
          // }
        }
      });
    },
  },
});

const RscOptions: Partial<ToRscOptions> = {
  plugins: [RSC_TRANSFORM_PLUGIN],
  stateType: 'variables',
};

export const componentToRsc: TranspilerGenerator<Partial<ToRscOptions>> =
  (_options = {}) =>
  ({ component, path }) => {
    if (
      !checkIsDefined(component.meta.useMetadata?.rsc?.componentType) &&
      !checkIfIsClientComponent(component)
    ) {
      component.meta.useMetadata = {
        ...component.meta.useMetadata,
        rsc: {
          ...component.meta.useMetadata?.rsc,
          componentType: 'server',
        },
      };
    }
    const isRSC = component.meta.useMetadata?.rsc?.componentType === 'server';

    const options = mergeOptions<Partial<ToRscOptions>>(
      {
        rsc: true,
        ...(isRSC ? RscOptions : {}),
      },
      _options,
    );

    return componentToReact(options)({ component, path });
  };
