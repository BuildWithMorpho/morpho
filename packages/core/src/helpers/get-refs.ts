import traverse from 'neotraverse/legacy';
import { MorphoComponent } from '../types/morpho-component';
import { isMorphoNode } from './is-morpho-node';

export const getRefs = (json: MorphoComponent, refKey: string = 'ref') => {
  const refs = new Set<string>();
  traverse(json).forEach(function (item) {
    if (isMorphoNode(item)) {
      const binding = item.bindings[refKey];
      if (binding && typeof binding.code === 'string') {
        refs.add(binding.code);
      }
    }
  });

  return refs;
};
