import { mapValues } from 'lodash';
import { GETTER } from '../../helpers/patterns';
import { JSONObject } from '../../types/json';
import { MorphoComponent, StateValue, StateValueType } from '../../types/morpho-component';

const __DO_NOT_USE_FUNCTION_LITERAL_PREFIX = `@builder.io/morpho/function:`;
const __DO_NOT_USE_METHOD_LITERAL_PREFIX = `@builder.io/morpho/method:`;

/**
 * Maps the Builder State format to the Morpho State format.
 */
const mapJsonToStateValue = (value: any): StateValue => {
  if (typeof value === 'string') {
    if (value.startsWith(__DO_NOT_USE_FUNCTION_LITERAL_PREFIX)) {
      return { type: 'function', code: value.replace(__DO_NOT_USE_FUNCTION_LITERAL_PREFIX, '') };
    } else if (value.startsWith(__DO_NOT_USE_METHOD_LITERAL_PREFIX)) {
      const strippedValue = value.replace(__DO_NOT_USE_METHOD_LITERAL_PREFIX, '');
      const isGet = Boolean(strippedValue.match(GETTER));
      const type: StateValueType = isGet ? 'getter' : 'method';
      return { type, code: strippedValue };
    }
  }
  return { type: 'property', code: JSON.stringify(value) };
};

export const mapBuilderContentStateToMorphoState = (
  value: JSONObject,
): MorphoComponent['state'] => mapValues(value, mapJsonToStateValue);
