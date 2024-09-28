import { replaceIdentifiers } from '../../helpers/replace-identifiers';
import { stripStateAndPropsRefs } from '../../helpers/strip-state-and-props-refs';
import { MorphoComponent } from '../../types/morpho-component';
import { MorphoNode } from '../../types/morpho-node';
import { ToVueOptions } from './types';

export const addPropertiesToJson =
  (properties: MorphoNode['properties']) =>
  (json: MorphoNode): MorphoNode => ({
    ...json,
    properties: {
      ...json.properties,
      ...properties,
    },
  });

export const addBindingsToJson =
  (bindings: MorphoNode['bindings']) =>
  (json: MorphoNode): MorphoNode => ({
    ...json,
    bindings: {
      ...json.bindings,
      ...bindings,
    },
  });

const ON_UPDATE_HOOK_NAME = 'onUpdateHook';

export const getOnUpdateHookName = (index: number) => ON_UPDATE_HOOK_NAME + `${index}`;

export const invertBooleanExpression = (expression: string) => `!Boolean(${expression})`;

export function encodeQuotes(string: string) {
  return string.replace(/"/g, '&quot;');
}

// Transform <FooBar> to <foo-bar> as Vue2 needs
export const renameMorphoComponentsToKebabCase = (str: string) =>
  str.replace(/<\/?\w+/g, (match) => match.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase());

export function getContextNames(json: MorphoComponent) {
  return Object.keys(json.context.get);
}

// TODO: migrate all stripStateAndPropsRefs to use this here
// to properly replace context refs
export function processBinding({
  code,
  options,
  json,
  includeProps = true,
}: {
  code: string;
  options: ToVueOptions;
  json: MorphoComponent;
  includeProps?: boolean;
}): string {
  return replaceIdentifiers({
    code: stripStateAndPropsRefs(code, {
      includeState: true,
      includeProps,
      replaceWith: (name) => {
        if (name === 'children' || name.startsWith('children.')) {
          return 'this.$slots.default';
        }

        return 'this.' + name;
      },
    }),
    from: getContextNames(json),
    to: (name) => (options.api === 'options' ? `this.${name}` : `${name}.value`),
  });
}
