import { MorphoComponent } from '../types/morpho-component';
import { MorphoNode } from '../types/morpho-node';

export function isRootTextNode(json: MorphoComponent | MorphoNode) {
  const firstChild = json.children[0];
  return Boolean(json.children.length === 1 && firstChild && isTextNode(firstChild));
}

export function isTextNode(node: MorphoNode) {
  return Boolean(node.properties._text || node.bindings._text);
}
