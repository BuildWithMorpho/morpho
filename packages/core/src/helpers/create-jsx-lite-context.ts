import { JSXLiteContext } from '../types/morpho-context';

export function createJsxLiteContext(
  options: Partial<JSXLiteContext> & { name: string },
): JSXLiteContext {
  return {
    '@type': '@builder.io/morpho/context',
    value: {},
    ...options,
  };
}
