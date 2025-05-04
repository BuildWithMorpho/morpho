import { MorphoNode } from '@/types/morpho-node';

export const getBuilderTagName = (node: MorphoNode) => {
  return node.properties.$tagName;
};
