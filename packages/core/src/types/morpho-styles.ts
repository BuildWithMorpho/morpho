export type MorphoStyles = Omit<
  Partial<CSSStyleDeclaration>,
  | 'length'
  | 'getPropertyPriority'
  | 'getPropertyValue'
  | 'item'
  | 'removeProperty'
  | 'setProperty'
  | 'parentRule'
>;
