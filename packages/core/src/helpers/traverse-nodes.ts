import { MorphoComponent } from '@/types/morpho-component';
import { MorphoNode } from '@/types/morpho-node';
import traverse, { type TraverseContext } from 'neotraverse/legacy';
import { isMorphoNode } from './is-morpho-node';

export function traverseNodes(
  component: MorphoComponent | MorphoNode,
  cb: (node: MorphoNode, context: TraverseContext) => void,
) {
  traverse(component).forEach(function (item) {
    if (isMorphoNode(item)) {
      cb(item, this);
    }
  });
}
