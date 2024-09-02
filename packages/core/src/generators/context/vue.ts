import { MorphoContext } from '../../types/morpho-context';

type ContextToVueOptions = {
  format?: boolean;
};

export function contextToVue(context: MorphoContext, options: ContextToVueOptions = {}): string {
  let str = `
    // Noop file
    export default {};
  `;

  return str;
}
