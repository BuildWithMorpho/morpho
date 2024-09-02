import { MorphoNode } from '../types/morpho-node';

export const isMorphoNode = (thing: unknown): thing is MorphoNode => {
  return Boolean(thing && (thing as any)['@type'] === '@builder.io/morpho/node');
};
