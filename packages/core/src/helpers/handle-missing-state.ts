import { MorphoComponent } from '..';
import { getStateUsed } from './get-state-used';

export function handleMissingState(json: MorphoComponent) {
  const stateUsed = getStateUsed(json);
  Array.from(stateUsed).forEach((property) => {
    if (!(property in json.state)) {
      json.state[property] = { code: 'null', type: 'property', propertyType: 'normal' };
    }
  });
}
