import { blockToAngular } from '@/generators/angular/classic/blocks';
import { AngularBlockOptions, ToAngularOptions } from '@/generators/angular/types';
import { indent } from '@/helpers/indent';
import { isMorphoNode } from '@/helpers/is-morpho-node';
import { replaceNodes } from '@/helpers/replace-identifiers';
import {
  DO_NOT_USE_VARS_TRANSFORMS,
  stripStateAndPropsRefs,
} from '@/helpers/strip-state-and-props-refs';
import { nodeHasCss } from '@/helpers/styles/helpers';
import { type MorphoComponent } from '@/types/morpho-component';
import { MorphoNode } from '@/types/morpho-node';
import * as babel from '@babel/core';
import { pipe } from 'fp-ts/function';
import traverse from 'neotraverse/legacy';

export const HELPER_FUNCTIONS = (
  isTs?: boolean,
): {
  [key: string]: string;
} => ({
  useObjectWrapper: `useObjectWrapper(...args${isTs ? ': any[]' : ''}) {
    let obj = {}
    args.forEach((arg) => {
      obj = { ...obj, ...arg };
    });
    return obj;
  }`,
  useObjectDotValues: `useObjectDotValues(obj${isTs ? ': any' : ''})${isTs ? ': any[]' : ''}) {
    return Object.values(obj);
  }`,
  useTypeOf: `useTypeOf(obj${isTs ? ': any' : ''})${isTs ? ': string' : ''}) {
    return typeof obj;
  }`,
  useJsonStringify: `useJsonStringify(...args${isTs ? ': any' : ''})${isTs ? ': string' : ''}) {
    return JSON.stringify(...args);
  }`,
  setAttributes: `setAttributes(el${isTs ? ': HTMLElement' : ''}, value${
    isTs ? ': any' : ''
  }, changes${isTs ? '?: any' : ''}) {
    if (!el) {
      return;
    }
    const target = typeof changes === 'undefined' ? value : changes;
    Object.keys(target).forEach((key) => {
      if (key.startsWith('on')) {
        if (this._listenerFns.has(key)) {
          this._listenerFns.get(key)${isTs ? '!' : ''}();
        }
        this._listenerFns.set(key, this.renderer.listen(
          el,
          key.replace('on', '').toLowerCase(),
          target[key]
        ));
      } else {
        this.renderer.setAttribute(el, key.toLowerCase(), target[key] ?? '');
      }
    });
  }`,
});

export const getAppropriateTemplateFunctionKeys = (code: string) =>
  Object.keys(HELPER_FUNCTIONS()).filter((key) => code.includes(key));

export const getDefaultProps = ({ defaultProps }: MorphoComponent) => {
  if (!defaultProps) return '';
  const defalutPropsString = Object.keys(defaultProps)
    .map((prop) => {
      const value = defaultProps!.hasOwnProperty(prop) ? defaultProps![prop]?.code : 'undefined';
      return `${prop}: ${value}`;
    })
    .join(',');
  return `const defaultProps: any = {${defalutPropsString}};\n`;
};

/**
 * if any state "property" is trying to access state.* or props.*
 * then we need to move them to onInit where they can be accessed
 * @param json The MorphoComponent.
 */
export const transformState = (json: MorphoComponent) => {
  Object.entries(json.state)
    .reverse()
    .forEach(([key, value]) => {
      if (value?.type === 'property') {
        if (value.code && (value.code.includes('state.') || value.code.includes('props.'))) {
          const code = stripStateAndPropsRefs(value.code, { replaceWith: 'this' });
          json.state[key]!.code = 'null';
          if (!json.hooks.onInit?.code) {
            json.hooks.onInit = { code: '' };
          }
          json.hooks.onInit.code = `\nthis.${key} = ${code};\n${json.hooks.onInit.code}`;
        }
      }
    });
};

/**
 * Checks if the first child has a "key" attribute - used for "For" elements
 * @param node The node which should be "For"
 */
export const hasFirstChildKeyAttribute = (node: MorphoNode): boolean => {
  if (!node.children || node.children.length === 0) {
    return false;
  }

  const firstChildBinding = node.children[0].bindings;
  return Boolean(firstChildBinding && firstChildBinding.key?.code);
};

export const preprocessCssAsJson = (json: MorphoComponent) => {
  traverse(json).forEach((item) => {
    if (isMorphoNode(item)) {
      if (nodeHasCss(item)) {
        if (item.bindings.css?.code?.includes('&quot;')) {
          item.bindings.css.code = item.bindings.css.code.replace(/&quot;/g, '"');
        }
      }
    }
  });
};

export const generateNgModule = (
  content: string,
  name: string,
  componentsUsed: string[],
  component: MorphoComponent,
  bootstrapMapper: Function | null | undefined,
): string => {
  return `import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

${content}

@NgModule({
  declarations: [${name}],
  imports: [CommonModule${
    componentsUsed.length ? ', ' + componentsUsed.map((comp) => `${comp}Module`).join(', ') : ''
  }],
  exports: [${name}],
  ${bootstrapMapper ? bootstrapMapper(name, componentsUsed, component) : ''}
})
export class ${name}Module {}`;
};

export const traverseToGetAllDynamicComponents = (
  json: MorphoComponent,
  options: ToAngularOptions,
  blockOptions: AngularBlockOptions,
) => {
  const components: Set<string> = new Set();
  let dynamicTemplate = '';
  traverse(json).forEach((item) => {
    if (isMorphoNode(item) && item.name.includes('.') && item.name.split('.').length === 2) {
      const children = item.children
        .map((child) => blockToAngular({ root: json, json: child, options, blockOptions }))
        .join('\n');
      dynamicTemplate = `<ng-template #${
        item.name.split('.')[1].toLowerCase() + 'Template'
      }>${children}</ng-template>`;
      components.add(item.name);
    }
  });
  return {
    components,
    dynamicTemplate,
  };
};

export const getTemplateFormat = (template: string): string =>
  indent(template, 8).replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

export const traverseAndCheckIfInnerHTMLIsUsed = (json: MorphoComponent) => {
  let innerHTMLIsUsed = false;
  traverse(json).forEach((item) => {
    if (isMorphoNode(item)) {
      Object.keys(item.bindings).forEach((key) => {
        if (key === 'innerHTML') {
          innerHTMLIsUsed = true;
          return;
        }
      });
    }
  });
  return innerHTMLIsUsed;
};

const { types } = babel;

/**
 * Prefixes state identifiers with this.
 * e.g. state.foo --> this.foo
 */
const prefixState = (code: string): string => {
  return replaceNodes({
    code,
    nodeMaps: [
      {
        from: types.identifier('state'),
        to: types.thisExpression(),
      },
    ],
  }).trim();
};

export const processAngularCode =
  ({
    contextVars,
    outputVars,
    domRefs,
    replaceWith,
  }: {
    contextVars: string[];
    outputVars: string[];
    domRefs: string[];
    replaceWith?: string;
  }) =>
  (code: string) =>
    pipe(
      DO_NOT_USE_VARS_TRANSFORMS(code, {
        contextVars,
        domRefs,
        outputVars,
      }),
      /**
       * Only prefix state that is in the Angular class component.
       * Do not prefix state referenced in the template
       */
      replaceWith === 'this' ? prefixState : (x) => x,
      (newCode) => stripStateAndPropsRefs(newCode, { replaceWith }),
    );
