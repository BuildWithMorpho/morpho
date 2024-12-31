import { isMorphoNode } from '@/helpers/is-morpho-node';
import { stripStateAndPropsRefs } from '@/helpers/strip-state-and-props-refs';
import { MorphoComponent } from '@/types/morpho-component';
import { MorphoNode } from '@/types/morpho-node';
import { upperFirst } from 'lodash';
import traverse from 'traverse';

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

function getRefName(path: string) {
  return upperFirst(path) + 'Ref';
}

export function getCode(str: string = '', options: ToReactOptions): string {
  return processBinding(str, options);
}

export function processTagReferences(json: MorphoComponent, options: ToReactOptions) {
  const namesFound = new Set<string>();

  traverse(json).forEach((el) => {
    if (!isMorphoNode(el)) {
      return;
    }

    const processedRefName = processBinding(el.name, options);

    if (el.name.includes('state.')) {
      switch (json.state[processedRefName]?.type) {
        case 'getter':
          const refName = getRefName(processedRefName);
          if (!namesFound.has(el.name)) {
            namesFound.add(el.name);
            json.hooks.init = {
              ...json.hooks.init,
              code: `
            ${json.hooks.init?.code || ''}
            const ${refName} = ${el.name};
            `,
            };
          }

          el.name = refName;
          break;

        // NOTE: technically, it should be impossible for the tag to be a method or a function in Morpho JSX syntax,
        // as that will fail JSX parsing.
        case 'method':
        case 'function':

        case 'property':
          const capitalizedName = upperFirst(processedRefName);

          if (capitalizedName !== processedRefName) {
            el.name = capitalizedName;
            json.state[capitalizedName] = { ...json.state[processedRefName]! };

            delete json.state[processedRefName];
          } else {
            el.name = processedRefName;
          }

          break;
      }
    } else {
      el.name = processedRefName;
    }
  });
}
