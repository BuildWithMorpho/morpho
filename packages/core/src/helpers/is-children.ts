import { MorphoNode } from '../types/morpho-node';

export default function isChildren({
  node,
  extraMatches = [],
}: {
  node: MorphoNode;
  extraMatches?: string[];
}): boolean {
  const textValue = node.bindings._text?.code || node.properties.__text || '';
  const trimmedTextValue = textValue.replace(/\s+/g, '');
  return ['props.children', 'children'].concat(extraMatches).includes(trimmedTextValue);
}
