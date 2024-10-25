import { Binding } from '../types/morpho-node';

export const createSingleBinding = (args: Omit<Binding, 'type'>): Binding => ({
  ...args,
  type: 'single',
});
