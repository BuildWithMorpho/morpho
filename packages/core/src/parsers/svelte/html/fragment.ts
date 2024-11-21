import { parseChildren } from '../helpers/children';
import { createMorphoNode } from '../helpers/morpho-node';

import type { TemplateNode } from 'svelte/types/compiler/interfaces';
import type { SveltosisComponent } from '../types';

export function parseFragment(json: SveltosisComponent, node: TemplateNode) {
  let morphoNode = createMorphoNode();

  morphoNode.name = 'Fragment';
  morphoNode.children = parseChildren(json, node);

  // if there is only one child, don't even bother to render the fragment as it is not necessary
  if (morphoNode.children.length === 1) {
    morphoNode = morphoNode.children[0];
  }
  return morphoNode;
}
