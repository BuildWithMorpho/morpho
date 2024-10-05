import traverse from 'traverse';
import { MorphoComponent } from '../types/morpho-component';
import { isMorphoNode } from './is-morpho-node';
import isChildren from './is-children';

export const hasBindingsText = (json: MorphoComponent) => {
  let has = false;
  traverse(json).forEach(function (node) {
    if (isMorphoNode(node) && !isChildren({ node }) && node.bindings._text?.code) {
      has = true;
      this.stop();
    }
  });
  return has;
};
