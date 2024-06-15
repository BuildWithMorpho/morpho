import { JSXLiteComponent } from '../types/morpho-component';

export const createJSXLiteComponent = (
  options?: Partial<JSXLiteComponent>,
): JSXLiteComponent => ({
  '@type': '@builder.io/morpho/component',
  imports: [],
  meta: {},
  state: {},
  children: [],
  hooks: {},
  context: { get: {}, set: {} },
  name: options?.name || 'MyComponent',
  subComponents: [],
  ...options,
});
