import { MorphoComponent } from '../../types/morpho-component';
import { MorphoNode } from '../../types/morpho-node';
import { stripStateAndPropsRefs } from '../../helpers/strip-state-and-props-refs';

import { ToReactOptions } from './types';

export const processBinding = (str: string, options: ToReactOptions) => {
  if (options.stateType !== 'useState') {
    return str;
  }

  return stripStateAndPropsRefs(str, {
    includeState: true,
    includeProps: false,
  });
};

export const openFrag = (options: ToReactOptions) => getFragment('open', options);
export const closeFrag = (options: ToReactOptions) => getFragment('close', options);
export function getFragment(type: 'open' | 'close', options: ToReactOptions) {
  const tagName = options.preact ? 'Fragment' : '';
  return type === 'open' ? `<${tagName}>` : `</${tagName}>`;
}
export const wrapInFragment = (json: MorphoComponent | MorphoNode) => json.children.length !== 1;
