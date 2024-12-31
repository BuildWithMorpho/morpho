import { MorphoComponent } from '../types/morpho-component';
import { Overwrite, Prettify } from './typescript';

type PartialMorphoComponent = Prettify<
  Overwrite<
    Partial<MorphoComponent>,
    {
      hooks: Partial<MorphoComponent['hooks']>;
    }
  >
>;

export const createMorphoComponent = (options?: PartialMorphoComponent): MorphoComponent => {
  const { name, hooks, ...remainingOpts } = options || {};
  const { onEvent = [], onMount = [], ...remainingHooks } = hooks || {};
  return {
    '@type': '@builder.io/morpho/component',
    imports: [],
    exports: {},
    inputs: [],
    meta: {},
    refs: {},
    state: {},
    children: [],
    context: { get: {}, set: {} },
    subComponents: [],
    name: name || 'MyComponent',
    hooks: {
      onMount,
      onEvent,
      ...remainingHooks,
    },
    ...remainingOpts,
  };
};
