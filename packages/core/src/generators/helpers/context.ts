import { MorphoComponent } from '../../types/morpho-component';

export const hasContext = (component: MorphoComponent) =>
  hasSetContext(component) || hasGetContext(component);

export const hasSetContext = (component: MorphoComponent) =>
  Object.keys(component.context.set).length > 0;

export const hasGetContext = (component: MorphoComponent) =>
  Object.keys(component.context.get).length > 0;
