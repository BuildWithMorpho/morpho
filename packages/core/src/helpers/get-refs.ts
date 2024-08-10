import traverse from 'traverse';
import { MorphoComponent } from '../types/morpho-component';
import { isMorphoNode } from './is-morpho-node';

export const getRefs = (json: MorphoComponent) => {
  const refs = new Set<string>();
  traverse(json).forEach(function (item) {
    if (isMorphoNode(item)) {
      if (typeof item.bindings.ref === 'string') {
        refs.add(item.bindings.ref);
      }
    }
  });

  return refs;
};
