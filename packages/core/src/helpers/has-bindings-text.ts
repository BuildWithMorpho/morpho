import traverse from 'neotraverse/legacy';
import { MorphoComponent } from '../types/morpho-component';
import isChildren from './is-children';
import { isMorphoNode } from './is-morpho-node';

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
