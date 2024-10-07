import { parseHtmlNode } from '../html';
import type { TemplateNode } from 'svelte/types/compiler/interfaces';
import type { MorphoNode } from '../../../types/morpho-node';
import type { SveltosisComponent } from '../types';

export function filterChildren(children: TemplateNode[]) {
  return (
    children?.filter((n) => n.type !== 'Comment' && (n.type !== 'Text' || n.data?.trim().length)) ??
    []
  );
}

export function parseChildren(json: SveltosisComponent, node: TemplateNode) {
  const children: MorphoNode[] = [];

  if (node.children) {
    for (const child of filterChildren(node.children)) {
      const morphoNode = parseHtmlNode(json, child);
      if (morphoNode) {
        children.push(morphoNode);
      }
    }
  }

  return children;
}
