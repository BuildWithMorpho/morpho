import {
  ContextGetInfo,
  ContextSetInfo,
  MorphoComponent,
  ReactivityType,
} from '@/types/morpho-component';

export const hasContext = (component: MorphoComponent) =>
  hasSetContext(component) || hasGetContext(component);

export const hasSetContext = (component: MorphoComponent) =>
  Object.keys(component.context.set).length > 0;

export const hasGetContext = (component: MorphoComponent) =>
  Object.keys(component.context.get).length > 0;

export const getContextType = ({
  component,
  context,
}: {
  component: MorphoComponent;
  context: ContextGetInfo | ContextSetInfo;
}): ReactivityType => {
  // TO-DO: remove useMetadata check if no longer needed.
  return component.meta.useMetadata?.contextTypes?.[context.name] || context.type || 'normal';
};
