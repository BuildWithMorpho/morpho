import { MorphoContext } from '../types/morpho-context';

export function createMorphoContext(
  options: Partial<MorphoContext> & { name: string },
): MorphoContext {
  return {
    '@type': '@builder.io/morpho/context',
    value: {},
    ...options,
  };
}
