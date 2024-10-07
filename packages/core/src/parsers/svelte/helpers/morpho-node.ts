import { MorphoNode } from '../../../types/morpho-node';

export function createMorphoNode(): MorphoNode {
  return {
    '@type': '@builder.io/morpho/node',
    name: '',
    meta: {},
    scope: {},
    children: [],
    bindings: {},
    properties: {},
  };
}
