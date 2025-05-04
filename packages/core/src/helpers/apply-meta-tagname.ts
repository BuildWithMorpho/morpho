import traverse from 'neotraverse/legacy';
import { MorphoComponent } from '../types/morpho-component';
import { isMorphoNode } from './is-morpho-node';

export const applyMetaTagName = (json: MorphoComponent) => {
  traverse(json).forEach((item) => {
    if (isMorphoNode(item)) {
      if (item.properties.$tagName) {
        item.name = item.properties.$tagName;
        delete item.properties.$tagName;
      }
    }
  });

  return json;
};
