import { isMorphoNode } from '@/helpers/is-morpho-node';
import { stripStateAndPropsRefs } from '@/helpers/strip-state-and-props-refs';
import { MorphoComponent } from '@/types/morpho-component';
import { MorphoNode } from '@/types/morpho-node';
import { upperFirst } from 'lodash';
import traverse from 'neotraverse/legacy';

import { ToReactOptions } from './types';

export const processBinding = (str: string, options: ToReactOptions) => {
  // fix web-component tag transform issue with dashes by not transforming it
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
export const isFragmentWithKey = (node?: MorphoNode): boolean =>
  node?.name === 'Fragment' && !!node?.bindings['key'];
export function getFragment(type: 'open' | 'close', options: ToReactOptions, node?: MorphoNode) {
  let tag = '';
  if (node && node.bindings && isFragmentWithKey(node)) {
    tag = options.preact ? 'Fragment' : 'React.Fragment';
    const keyCode = node.bindings['key']?.code;
    if (type === 'open' && keyCode) {
      tag += ` key={${processBinding(keyCode, options)}}`;
    }
  } else if (options.preact) {
    tag = 'Fragment';
  }
  return type === 'open' ? `<${tag}>` : `</${tag}>`;
}
export const wrapInFragment = (json: MorphoComponent | MorphoNode) => json.children.length !== 1;

function getRefName(path: string) {
  return upperFirst(path) + 'Ref';
}

export function processTagReferences(json: MorphoComponent, options: ToReactOptions) {
  const namesFound = new Set<string>();

  traverse(json).forEach((el) => {
    if (!isMorphoNode(el)) {
      return;
    }

    const processedRefName = el.name.includes('-') ? el.name : processBinding(el.name, options);

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
