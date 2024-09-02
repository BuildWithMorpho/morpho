import { MorphoComponent } from '../../types/morpho-component';

export const hasContext = (component: MorphoComponent) =>
  Boolean(Object.keys(component.context.get).length || Object.keys(component.context.set).length);
