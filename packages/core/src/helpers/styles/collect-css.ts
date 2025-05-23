import traverse from 'neotraverse/legacy';
import hash from 'object-hash';
import { MorphoComponent } from '../../types/morpho-component';
import { MorphoNode } from '../../types/morpho-node';
import { dashCase } from '../dash-case';
import { isMorphoNode } from '../is-morpho-node';
import {
  ClassStyleMap,
  getNestedSelectors,
  getStylesOnly,
  nodeHasCss,
  parseCssObject,
  styleMapToCss,
} from './helpers';

type CollectStyleOptions = {
  prefix?: string;
};

const trimClassStr = (classStr: string) => classStr.trim().replace(/\s{2,}/g, ' ');

const updateClassForNode = (item: MorphoNode, className: string) => {
  if (item.bindings.class) {
    // combine className with existing binding. We use single quotes because in Vue, bindings are wrapped in double quotes
    // e.g. <div :class="_classStringToObject(this.className + ' div-21azgz5avex')" />
    item.bindings.class.code = trimClassStr(`${item.bindings.class.code} + ' ${className}'`);
  } else {
    item.properties.class = trimClassStr(`${item.properties.class || ''} ${className}`);
  }
};

export function normalizeName(name: string | undefined): string {
  if (!name || name.trim() === '' || name.match(/^[^a-zA-Z0-9]*$/)) {
    return '';
  }

  // Clean the name first
  const cleaned = name.replace(/[^a-zA-Z0-9\-_]/g, '');

  // If pure numeric or only contains numbers and dashes
  if (cleaned.match(/^[0-9-]+$/)) {
    // Extract just the numbers and format as css{number}
    const numbers = cleaned.replace(/[^0-9]/g, '');
    return `css${numbers}`;
  }

  // Remove leading numbers and dashes for other cases
  const normalized = cleaned.replace(/^[0-9-]+(?=[a-zA-Z])/, '');

  return normalized || '';
}

const collectStyles = (
  json: MorphoComponent,
  options: CollectStyleOptions = {},
): ClassStyleMap => {
  const styleMap: ClassStyleMap = {};

  const componentIndexes: { [className: string]: number | undefined } = {};
  const componentHashes: { [className: string]: string | undefined } = {};

  traverse(json).forEach(function (item) {
    if (isMorphoNode(item)) {
      if (nodeHasCss(item)) {
        const value = parseCssObject(item.bindings.css?.code as string);
        delete item.bindings.css;

        const normalizedName = normalizeName(item.properties.$name);

        const componentName = normalizedName
          ? dashCase(normalizedName)
          : /^h\d$/.test(item.name || '') // don't dashcase h1 into h-1
          ? item.name
          : dashCase(normalizeName(item.name) || 'div');

        const classNameWPrefix = `${componentName}${options.prefix ? `-${options.prefix}` : ''}`;

        const stylesHash = hash(value);
        if (componentHashes[componentName] === stylesHash) {
          const className = classNameWPrefix;
          updateClassForNode(item, className);
          return;
        }

        if (!componentHashes[componentName]) {
          componentHashes[componentName] = stylesHash;
        }

        const index = (componentIndexes[componentName] =
          (componentIndexes[componentName] || 0) + 1);
        const className = `${classNameWPrefix}${index === 1 ? '' : `-${index}`}`;

        updateClassForNode(item, className);

        styleMap[className] = value;
      }
      delete item.bindings.css;
    }
  });

  return styleMap;
};

export const collectCss = (json: MorphoComponent, options: CollectStyleOptions = {}): string => {
  const styles = collectStyles(json, options);
  // TODO create and use a root selector
  let css = '';
  css += !!json.style?.length ? `${json.style}\n` : '';
  css += classStyleMapToCss(styles);
  return css;
};

const classStyleMapToCss = (map: ClassStyleMap): string => {
  let str = '';

  for (const key in map) {
    const styles = getStylesOnly(map[key]);
    str += `.${key} {\n${styleMapToCss(styles)}\n}`;

    const nestedSelectors = getNestedSelectors(map[key]);
    for (const nestedSelector in nestedSelectors) {
      const value = nestedSelectors[nestedSelector] as any;

      if (nestedSelector.startsWith('@')) {
        str += `${nestedSelector} { .${key} { ${styleMapToCss(value)} } }`;
      } else {
        const getSelector = (nestedSelector: string) => {
          if (nestedSelector.startsWith(':')) {
            return `.${key}${nestedSelector}`;
          }

          if (nestedSelector.includes('&')) {
            return nestedSelector.replace(/&/g, `.${key}`);
          }

          return `.${key} ${nestedSelector}`;
        };

        str += `${getSelector(nestedSelector)} {\n${styleMapToCss(value)}\n}`;
      }
    }
  }

  return str;
};
