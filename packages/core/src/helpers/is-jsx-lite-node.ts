import { JSXLiteNode } from '../types/morpho-node';

export const isJsxLiteNode = (thing: unknown): thing is JSXLiteNode => {
  return Boolean(
    thing && (thing as any)['@type'] === '@builder.io/morpho/node',
  );
};
