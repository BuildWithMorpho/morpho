import { MorphoNode } from '../types/morpho-node';

export default function isChildren(node: MorphoNode): boolean {
  return (
    `${node.bindings._text?.code || ''}`.replace(/\s+/g, '') ===
    'props.children'
  );
}
