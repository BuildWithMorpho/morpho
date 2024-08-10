import traverse from 'traverse';
import { MorphoComponent } from '../types/morpho-component';
import { isMorphoNode } from './is-morpho-node';

export const hasComponent = (name: string, json: MorphoComponent) => {
  let has = false;
  traverse(json).forEach(function (item) {
    if (isMorphoNode(item)) {
      if (item.name === name) {
        has = true;
        this.stop();
      }
    }
  });
  return has;
};
