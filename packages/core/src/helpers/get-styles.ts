import * as CSS from 'csstype';
import json5 from 'json5';
import { size } from 'lodash';
import { MorphoNode } from '../types/morpho-node';
import { MorphoStyles } from '../types/morpho-styles';

export const getStyles = (json: MorphoNode) => {
  if (!json.bindings.css) {
    return null;
  }
  let css: MorphoStyles;
  try {
    css = json5.parse(json.bindings.css?.code);
  } catch (err) {
    console.warn('Could not json 5 parse css', err, json.bindings.css.code);
    return null;
  }
  return css;
};

export const setStyles = (json: MorphoNode, styles: MorphoStyles | null) => {
  if (!size(styles)) {
    delete json.bindings.css;
  } else {
    json.bindings.css = { code: json5.stringify(styles) };
  }
};
