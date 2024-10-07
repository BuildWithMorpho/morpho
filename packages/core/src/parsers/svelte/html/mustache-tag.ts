import { generate } from 'astring';
import type { TemplateNode } from 'svelte/types/compiler/interfaces';
import { createMorphoNode } from '../helpers/morpho-node';

export function parseMustacheTag(node: TemplateNode) {
  const morphoNode = createMorphoNode();
  morphoNode.name = 'div';
  morphoNode.bindings['_text'] = {
    code: generate(node.expression),
  };
  return morphoNode;
}

export function parseRawMustacheTag(node: TemplateNode) {
  const morphoNode = createMorphoNode();
  morphoNode.name = 'div';
  morphoNode.bindings.innerHTML = {
    code: generate(node.expression),
  };
  return morphoNode;
}
