import { MorphoNode } from '../types/morpho-node';

export const isEmptyTextNode = (node: MorphoNode) => {
  return typeof node.properties._text === 'string' && node.properties._text.trim().length === 0;
};

export const filterEmptyTextNodes = (node: MorphoNode) => !isEmptyTextNode(node);
