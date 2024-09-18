import { MorphoState } from './morpho-component';

export type MorphoContext = {
  '@type': '@builder.io/morpho/context';
  name: string;
  value: MorphoState;
};
