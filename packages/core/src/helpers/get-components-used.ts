import { MorphoComponent } from '../types/morpho-component';
import traverse from 'traverse';
import { isMorphoNode } from './is-morpho-node';

export function getComponentsUsed(json: MorphoComponent) {
  const components = new Set<string>();

  traverse(json).forEach(function (item) {
    if (isMorphoNode(item)) {
      components.add(item.name);
    }
  });

  return components;
}
