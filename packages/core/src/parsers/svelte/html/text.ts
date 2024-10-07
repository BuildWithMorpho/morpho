import type { TemplateNode } from 'svelte/types/compiler/interfaces';
import { createMorphoNode } from '../helpers/morpho-node';

export function parseText(node: TemplateNode) {
  return {
    ...createMorphoNode(),
    name: 'div',
    properties: {
      _text: node.data,
    },
  };
}
