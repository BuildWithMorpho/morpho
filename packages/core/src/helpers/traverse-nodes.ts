import { JSXLiteComponent } from '../types/morpho-component';
import { JSXLiteNode } from '../types/morpho-node';
import traverse, { TraverseContext } from 'traverse';
import { isJsxLiteNode } from './is-morpho-node';

export function tarverseNodes(
  component: JSXLiteComponent | JSXLiteNode,
  cb: (node: JSXLiteNode, context: TraverseContext) => void,
) {
  traverse(component).forEach(function(item) {
    if (isJsxLiteNode(item)) {
      cb(item, this);
    }
  });
}
