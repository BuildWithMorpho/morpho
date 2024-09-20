import { MorphoNode } from '../types/morpho-node';

export function getBindingsCode(children: MorphoNode[]): string[] {
  const bindings: string[] = [];
  children.forEach((child) => {
    Object.values(child.bindings || []).forEach((binding) => {
      bindings.push(binding!.code);
    });
    if (child.children) {
      bindings.push(...getBindingsCode(child.children));
    }
  });

  return bindings;
}
