import * as CSS from 'csstype';
import json5 from 'json5';
import { pickBy } from 'lodash';
import traverse from 'traverse';
import { MorphoComponent } from '../../types/morpho-component';
import { MorphoNode } from '../../types/morpho-node';
import { dashCase } from '../dash-case';
import { isMorphoNode } from '../is-morpho-node';

export const nodeHasCss = (node: MorphoNode) => {
  return Boolean(
    typeof node.bindings.css?.code === 'string' && node.bindings.css.code.trim().length > 6,
  );
};

export const nodeHasStyle = (node: MorphoNode) => {
  return (
    Boolean(typeof node.bindings.style?.code === 'string') ||
    Boolean(typeof node.properties.style === 'string')
  );
};

export const hasCss = (component: MorphoComponent) => {
  let hasStyles = !!component.style?.length;

  if (hasStyles) {
    return true;
  }

  traverse(component).forEach(function (item) {
    if (isMorphoNode(item)) {
      if (nodeHasCss(item)) {
        hasStyles = true;
        this.stop();
      }
    }
  });
  return hasStyles;
};

export const hasStyle = (component: MorphoComponent) => {
  let hasStyles = false;

  traverse(component).forEach(function (item) {
    if (isMorphoNode(item)) {
      if (nodeHasStyle(item)) {
        hasStyles = true;
        this.stop();
      }
    }
  });
  return hasStyles;
};

/**
 * e.g.:
 * {
 *  display: 'none',
 *  '@media (max-width: 500px)': {
 *    '& .sub-class': {
 *      display: 'block'
 *    }
 *  }
 * }
 */
export type StyleMap = {
  [className: string]: CSS.Properties | StyleMap;
};

export const getNestedSelectors = (map: StyleMap) => {
  return pickBy(map, (value) => typeof value === 'object');
};
export const getStylesOnly = (map: StyleMap) => {
  return pickBy(map, (value) => typeof value === 'string');
};

/**
 * { 'my-class': { display: 'block', '&.foo': { display: 'none' } }}
 */
export type ClassStyleMap = { [key: string]: StyleMap };

export const parseCssObject = (css: string) => {
  try {
    return json5.parse(css);
  } catch (e) {
    console.warn('Could not parse CSS object', css);
    throw e;
  }
};

const parseCSSKey = (key: string) => {
  // Allow custom CSS properties
  if (key.startsWith('--')) {
    return key;
  }
  return dashCase(key);
};

export const styleMapToCss = (map: StyleMap): string => {
  return Object.entries(map)
    .filter(([key, value]) => typeof value === 'string')
    .map(([key, value]) => `  ${parseCSSKey(key)}: ${value};`)
    .join('\n');
};
