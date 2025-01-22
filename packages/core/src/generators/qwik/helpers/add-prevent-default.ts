import traverse from 'traverse';
import { isMorphoNode } from '../../../helpers/is-morpho-node';
import { MorphoComponent } from '../../../types/morpho-component';

/**
 * Find event handlers that explicitly call .preventDefault() and
 * add preventdefault:event
 * https://qwik.builder.io/tutorial/events/preventdefault
 */
export function addPreventDefault(json: MorphoComponent) {
  traverse(json).forEach((node) => {
    if (isMorphoNode(node)) {
      if (node.bindings) {
        for (const key of Object.keys(node.bindings)) {
          if (key.startsWith('on')) {
            if (node.bindings[key]?.code.includes('.preventDefault()')) {
              const event = key.slice(2).toLowerCase();
              node.properties['preventdefault:' + event] = '';
              node.bindings[key]!.code = node.bindings[key]!.code.replace(
                /.*?\.preventDefault\(\);?/,
                '',
              ).trim();
            }
          }
        }
      }
    }
  });
}
