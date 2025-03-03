import traverse from 'neotraverse/legacy';
import { MorphoComponent } from '../types/morpho-component';
import { isMorphoNode } from './is-morpho-node';

export const getRefs = (json: MorphoComponent) => {
  const refs = new Set<string>();
  traverse(json).forEach(function (item) {
    if (isMorphoNode(item)) {
      if (typeof item.bindings.ref?.code === 'string') {
        refs.add(item.bindings.ref.code);
      }
    }
  });

  return refs;
};
