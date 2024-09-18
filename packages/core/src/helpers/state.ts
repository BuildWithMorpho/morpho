import { MorphoComponent } from '../types/morpho-component';

export const checkHasState = (component: MorphoComponent) =>
  Boolean(Object.keys(component.state).length);
