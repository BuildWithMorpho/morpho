import { MorphoNode } from '../types/morpho-node';

export function getBindingsCode(children: MorphoNode[]): string[] {
  const bindings: string[] = [];
  children.forEach((child) => {
    if (child.bindings) {
      Object.keys(child.bindings).forEach((key) => {
        bindings.push(child.bindings[key]!.code);
      });
    }
    if (child.children) {
      bindings.push(...getBindingsCode(child.children));
    }
  });

  return bindings;
}
