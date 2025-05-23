import { MorphoNode } from '@/types/morpho-node';

// This should really be a preprocessor mapping the `class` attribute binding based on what other values have
// to make this more pluggable
export function collectClassString(
  json: MorphoNode,
  bindingOpenChar = '{',
  bindingCloseChar = '}',
): string | null {
  const staticClasses: string[] = [];

  const hasStaticClasses = Boolean(staticClasses.length);
  if (json.properties.class) {
    staticClasses.push(json.properties.class);
    delete json.properties.class;
  }
  if (json.properties.className) {
    staticClasses.push(json.properties.className);
    delete json.properties.className;
  }

  const dynamicClasses: string[] = [];
  if (typeof json.bindings.class?.code === 'string') {
    dynamicClasses.push(json.bindings.class.code as any);
    delete json.bindings.class;
  }
  if (typeof json.bindings.className?.code === 'string') {
    dynamicClasses.push(json.bindings.className.code as any);
    delete json.bindings.className;
  }

  const staticClassesString = staticClasses.join(' ');

  const dynamicClassesString = dynamicClasses.join(" + ' ' + ");

  const hasDynamicClasses = Boolean(dynamicClasses.length);

  if (hasStaticClasses && !hasDynamicClasses) {
    return `"${staticClassesString}"`;
  }

  if (hasDynamicClasses && !hasStaticClasses) {
    return `${bindingOpenChar}${dynamicClassesString}${bindingCloseChar}`;
  }

  if (hasDynamicClasses && hasStaticClasses) {
    return `${bindingOpenChar}"${staticClassesString} " + ${dynamicClassesString}${bindingCloseChar}`;
  }

  return null;
}
