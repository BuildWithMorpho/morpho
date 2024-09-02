import { MorphoNode } from '../types/morpho-node';

/**
 * This node is a component, vs a plain html tag (<Foo> vs <div>)
 */
export const isComponent = (json: MorphoNode) => json.name.toLowerCase() !== json.name;
