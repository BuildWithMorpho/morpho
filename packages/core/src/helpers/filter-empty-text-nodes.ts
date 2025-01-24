import { MorphoNode } from '../types/morpho-node';

export const filterEmptyTextNodes = (node: MorphoNode) =>
  !(typeof node.properties._text === 'string' && !node.properties._text.trim().length);
