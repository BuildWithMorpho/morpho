import { MorphoComponent } from '../types/morpho-component';

export const createMorphoComponent = (
  options?: Partial<MorphoComponent>,
): MorphoComponent => ({
  '@type': '@builder.io/morpho/component',
  imports: [],
  exports: {},
  inputs: [],
  meta: {},
  refs: {},
  state: {},
  children: [],
  hooks: {},
  context: { get: {}, set: {} },
  name: options?.name || 'MyComponent',
  subComponents: [],
  ...options,
});
