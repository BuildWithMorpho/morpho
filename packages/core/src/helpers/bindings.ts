import { Binding } from '../types/morpho-node';

type SingleBinding = Omit<Binding & { type: 'single' }, 'type'>;

export const createSingleBinding = (
  args: Omit<SingleBinding, 'bindingType'> & Partial<Pick<SingleBinding, 'bindingType'>>,
): Binding => ({
  ...args,
  bindingType: args.bindingType || 'expression',
  type: 'single',
});
