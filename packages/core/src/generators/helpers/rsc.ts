import { checkIsEvent } from '@/helpers/event-handlers';
import { isMorphoNode } from '@/helpers/is-morpho-node';
import type { MorphoComponent } from '@/types/morpho-component';
import type { MorphoNode } from '@/types/morpho-node';
import traverse from 'neotraverse/legacy';

const checkIsNodeAMorphoComponent = (node: MorphoNode) =>
  node.name[0] === node.name[0].toUpperCase();

export const checkIfIsClientComponent = (json: MorphoComponent) => {
  if (json.hooks.onMount.length) return true;
  if (json.hooks.onUnMount?.code) return true;
  if (json.hooks.onUpdate?.length) return true;
  if (Object.keys(json.refs).length) return true;
  if (Object.keys(json.context.set).length) return true;
  if (Object.keys(json.context.get).length) return true;
  if (Object.values(json.state).filter((s) => s?.type === 'property').length) return true;

  let foundEventListener = false;
  traverse(json).forEach(function (node) {
    if (isMorphoNode(node) && !checkIsNodeAMorphoComponent(node)) {
      if (Object.keys(node.bindings).filter((item) => checkIsEvent(item)).length) {
        foundEventListener = true;
        this.stop();
      }
    }
  });

  return foundEventListener;
};
