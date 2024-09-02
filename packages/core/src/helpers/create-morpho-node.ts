import { MorphoNode } from '../types/morpho-node';

export const createMorphoNode = (options: Partial<MorphoNode>): MorphoNode => ({
  '@type': '@builder.io/morpho/node',
  name: 'div',
  meta: {},
  scope: {},
  properties: {},
  bindings: {},
  children: [],
  ...options,
});
