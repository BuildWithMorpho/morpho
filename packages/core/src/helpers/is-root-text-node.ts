import { MorphoNode } from '../types/morpho-node';
import { MorphoComponent } from '../types/morpho-component';

export function isRootTextNode(json: MorphoComponent | MorphoNode) {
  const firstChild = json.children[0];
  return Boolean(firstChild && isTextNode(firstChild));
}

export function isTextNode(node: MorphoNode) {
  return Boolean(node.properties._text || node.bindings._text);
}
