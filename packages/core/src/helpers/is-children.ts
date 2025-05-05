import { MorphoNode } from '@/types/morpho-node';

export const getTextValue = (node: MorphoNode) => {
  const textValue = node.bindings._text?.code || node.properties.__text || '';
  return textValue.replace(/\s+/g, '');
};

export default function isChildren({
  node,
  extraMatches = [],
}: {
  node: MorphoNode;
  extraMatches?: string[];
}): boolean {
  const textValue = getTextValue(node);
  return ['props.children', 'children', 'children()'].concat(extraMatches).includes(textValue);
}
