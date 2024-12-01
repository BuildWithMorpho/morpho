import { ContextOptions, MorphoState } from './morpho-component';

export type MorphoContext = ContextOptions & {
  '@type': '@builder.io/morpho/context';
  name: string;
  value: MorphoState;
};
