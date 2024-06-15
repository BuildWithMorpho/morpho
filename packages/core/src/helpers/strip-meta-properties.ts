import traverse from 'traverse';
import { JSXLiteComponent } from '../types/morpho-component';
import { isJsxLiteNode } from './is-morpho-node';

export const stripMetaProperties = (json: JSXLiteComponent) => {
  traverse(json).forEach((item) => {
    if (isJsxLiteNode(item)) {
      for (const property in item.properties) {
        if (property.startsWith('$')) {
          delete item.properties[property];
        }
      }
      for (const property in item.bindings) {
        if (property.startsWith('$')) {
          delete item.bindings[property];
        }
      }
    }
  });

  return json;
};
