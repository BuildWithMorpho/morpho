import { upperFirst } from 'lodash';
import type { TemplateNode } from 'svelte/types/compiler/interfaces';
import { parseChildren } from '../helpers/children';
import { createMorphoNode } from '../helpers/morpho-node';

import type { SveltosisComponent } from '../types';

export function parseSlot(json: SveltosisComponent, node: TemplateNode) {
  const morphoNode = createMorphoNode();
  if (
    node.attributes.length > 0 &&
    node.attributes[0].value.length > 0 &&
    node.attributes[0].value[0].data?.trim().length
  ) {
    morphoNode.name = 'div';
    const slotName = upperFirst(node.attributes[0].value[0]?.data);

    morphoNode.bindings._text = {
      code: `props.slot${slotName}`,
    };
  } else {
    morphoNode.name = 'Slot';
  }

  morphoNode.children = parseChildren(json, node);

  return morphoNode;
}
