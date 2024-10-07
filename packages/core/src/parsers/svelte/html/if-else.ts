import { generate } from 'astring';

import { parseHtmlNode } from '.';
import { createMorphoNode } from '../helpers/morpho-node';
import { parseChildren } from '../helpers/children';

import type { TemplateNode } from 'svelte/types/compiler/interfaces';
import type { SveltosisComponent } from '../types';

export function parseIfElse(json: SveltosisComponent, node: TemplateNode) {
  const morphoNode = createMorphoNode();
  morphoNode.name = 'Show';
  morphoNode.bindings = {
    when: {
      code: generate(node.expression),
    },
  };

  morphoNode.children = parseChildren(json, node);

  if (node.else) {
    morphoNode.meta.else =
      node.else.children?.length === 1
        ? parseHtmlNode(json, node.else.children[0])
        : {
            ...createMorphoNode(),
            name: 'div',
            children: node.else.children?.map((n: TemplateNode) => parseHtmlNode(json, n)) ?? [],
          };
  }
  return morphoNode;
}
