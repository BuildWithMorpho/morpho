import { camelCase, upperFirst } from 'lodash';
import type { TemplateNode } from 'svelte/types/compiler/interfaces';
import { parseChildren } from '../helpers/children';
import { createMorphoNode } from '../helpers/morpho-node';

import type { SveltosisComponent } from '../types';

export function parseSlot(json: SveltosisComponent, node: TemplateNode) {
  const morphoNode = createMorphoNode();
  morphoNode.name = 'Slot';

  if (
    node.attributes.length > 0 &&
    node.attributes[0].value.length > 0 &&
    node.attributes[0].value[0].data?.trim().length
  ) {
    const slotName = upperFirst(camelCase(node.attributes[0].value[0]?.data));
    morphoNode.properties.name = slotName;
  }

  morphoNode.children = parseChildren(json, node);

  return morphoNode;
}
