import { camelCase, last, upperFirst } from 'lodash';
import traverse from 'traverse';
import { JSXLiteComponent } from '../types/morpho-component';
import { isJsxLiteNode } from './is-morpho-node';

function getRefName(path: string) {
  return upperFirst(camelCase(last(path.split('.')))) + 'Ref';
}

export function processTagReferences(json: JSXLiteComponent) {
  const namesFound = new Set<string>();

  traverse(json).forEach((el) => {
    if (isJsxLiteNode(el)) {
      if (el.name.includes('.')) {
        if (!namesFound.has(el.name)) {
          namesFound.add(el.name);
          if (typeof json.hooks.init !== 'string') {
            json.hooks.init = '';
          }

          json.hooks.init += `
            const ${getRefName(el.name)} = ${el.name};
          `;
        }
        el.name = getRefName(el.name);
      }
    }
  });
}
