import { JSXLiteNode } from '../types/morpho-node';

export const createJSXLiteNode = (
  options: Partial<JSXLiteNode>,
): JSXLiteNode => ({
  '@type': '@builder.io/morpho/node',
  name: 'div',
  meta: {},
  properties: {},
  bindings: {},
  children: [],
  ...options,
});
