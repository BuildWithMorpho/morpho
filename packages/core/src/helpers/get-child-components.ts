import { isMorphoNode } from '@/helpers/is-morpho-node';
import { MorphoComponent } from '@/types/morpho-component';
import traverse from 'neotraverse/legacy';

export const getChildComponents = (json: MorphoComponent): string[] => {
  const nodes: string[] = [];
  const childComponents: string[] = [json.name]; // a component can be recursively used in itself

  traverse(json).forEach(function (item) {
    if (isMorphoNode(item)) {
      nodes.push(item.name);
    }
  });

  for (const { imports } of json.imports) {
    for (const key of Object.keys(imports)) {
      if (nodes.includes(key)) {
        childComponents.push(key);
      }
    }
  }

  return childComponents;
};
