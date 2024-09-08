import * as CSS from 'csstype';
import { MorphoNode } from '../../types/morpho-node';
import traverse from 'traverse';
import { MorphoComponent } from '../../types/morpho-component';
import { isMorphoNode } from '../is-morpho-node';
import json5 from 'json5';
import { pickBy } from 'lodash';
import { dashCase } from '../dash-case';

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
  let hasStyles = false;

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

export const styleMapToCss = (map: StyleMap): string => {
  let str = '';

  for (const key in map) {
    const value = map[key];

    if (typeof value === 'string') {
      str += `\n${dashCase(key)}: ${value};`;
    } else {
      // TODO: do nothing
    }
  }

  return str;
};
