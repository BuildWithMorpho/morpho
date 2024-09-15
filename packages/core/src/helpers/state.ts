import { mapValues } from 'lodash';
import { JSONObject, _JSON } from '../types/json';
import { MorphoComponent, StateValue } from '../types/morpho-component';

export const checkHasState = (component: MorphoComponent) =>
  Boolean(Object.keys(component.state).length);

const mapJsonToStateValue = (value: _JSON): StateValue => ({
  code: value,
  type: 'property',
});

export const mapJsonObjectToStateValue = (value: JSONObject): MorphoComponent['state'] =>
  mapValues(value, mapJsonToStateValue);
