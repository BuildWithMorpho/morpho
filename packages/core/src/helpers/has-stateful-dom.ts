import traverse from 'traverse';
import { MorphoComponent } from '../types/morpho-component';
import { isMorphoNode } from './is-morpho-node';

export const hasStatefulDom = (json: MorphoComponent) => {
  let has = false;
  traverse(json).forEach(function (item) {
    if (isMorphoNode(item)) {
      if (/input|textarea|select/.test(item.name)) {
        has = true;
        this.stop();
      }
    }
  });
  return has;
};
