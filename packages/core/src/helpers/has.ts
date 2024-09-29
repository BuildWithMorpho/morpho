import traverse from 'traverse';
import { MorphoComponent } from '../types/morpho-component';
import { MorphoNode } from '../types/morpho-node';
import { isMorphoNode } from './is-morpho-node';

/**
 * Test if the component has something
 *
 * e.g.
 *    const hasSpread = has(component, node => some(node.bindings, { type: 'spread' }));
 */
export function has(json: MorphoComponent, test: (node: MorphoNode) => boolean) {
  let found = false;
  traverse(json).forEach(function (thing) {
    if (isMorphoNode(thing)) {
      if (test(thing)) {
        found = true;
        this.stop();
      }
    }
  });
  return found;
}
