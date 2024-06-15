import traverse from 'traverse';
import { MorphoComponent } from '../types/morpho-component';
import { isMorphoNode } from './is-morpho-node';
import { isUpperCase } from './is-upper-case';

export function getComponents(json: MorphoComponent): Set<string> {
  const components = new Set<string>();
  traverse(json).forEach(function(item) {
    if (isMorphoNode(item)) {
      if (isUpperCase(item.name[0])) {
        components.add(item.name);
      }
    }
  });

  return components;
}
