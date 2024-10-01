import { MorphoNode } from '../types/morpho-node';

export default function isChildren(node: MorphoNode): boolean {
  const textValue = node.bindings._text?.code || node.properties.__text || '';
  const trimmedTextValue = textValue.replace(/\s+/g, '');
  return ['props.children', 'children'].includes(trimmedTextValue);
}
