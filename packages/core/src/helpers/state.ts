import { mapValues } from 'lodash';
import { functionLiteralPrefix } from '../constants/function-literal-prefix';
import { methodLiteralPrefix } from '../constants/method-literal-prefix';
import { JSONObject, _JSON } from '../types/json';
import { MorphoComponent, StateValue, StateValueType } from '../types/morpho-component';
import { GETTER } from './patterns';

export const checkHasState = (component: MorphoComponent) =>
  Boolean(Object.keys(component.state).length);

/**
 * Sets StateTypeValue based on the string prefixes we've set previously.
 *
 * This is a temporary workaround until we eliminate the prefixes and make this StateValueType the
 * source of truth.
 */
export const getStateTypeOfValue = (value: any): StateValueType => {
  if (typeof value === 'string') {
    if (value.startsWith(functionLiteralPrefix)) {
      return 'function';
    } else if (value.startsWith(methodLiteralPrefix)) {
      const isGet = Boolean(value.replace(methodLiteralPrefix, '').match(GETTER));
      if (isGet) {
        return 'getter';
      }
      return 'method';
    }
  }
  return 'property';
};

const mapJsonToStateValue = (value: _JSON): StateValue => {
  return {
    code: value,
    type: getStateTypeOfValue(value),
  };
};

export const mapJsonObjectToStateValue = (value: JSONObject): MorphoComponent['state'] =>
  mapValues(value, mapJsonToStateValue);
