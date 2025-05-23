import { MorphoComponent, StateValue } from '../types/morpho-component';
import { MorphoContext } from '../types/morpho-context';

type ValueMapper = (
  code: string,
  type: 'data' | 'function' | 'getter',
  typeParameter: string | undefined,
  key: string | undefined,
) => string;

interface GetStateObjectStringOptions {
  data?: boolean;
  functions?: boolean;
  getters?: boolean;
  valueMapper?: ValueMapper;
  /**
   * If you want the plain value mapper as output
   */
  onlyValueMapper?: boolean;
  format?: 'object' | 'class' | 'variables';
  keyPrefix?: string;
  withType?: boolean;
}

type RequiredOptions = Required<GetStateObjectStringOptions>;

const DEFAULT_OPTIONS: RequiredOptions = {
  format: 'object',
  keyPrefix: '',
  valueMapper: (val) => val,
  onlyValueMapper: false,
  data: true,
  functions: true,
  getters: true,
  withType: false,
};

const convertStateMemberToString =
  ({
    data,
    format,
    functions,
    getters,
    keyPrefix,
    valueMapper,
    withType,
    onlyValueMapper,
  }: RequiredOptions) =>
  ([key, state]: [string, StateValue | undefined]): string | undefined => {
    const keyValueDelimiter = format === 'object' ? ':' : '=';

    if (!state) {
      return undefined;
    }

    const { code, typeParameter } = state;

    const type = withType && typeParameter ? `:${typeParameter}` : '';

    switch (state.type) {
      case 'function': {
        if (!functions) {
          return undefined;
        }
        const mapper = valueMapper(code, 'function', typeParameter, key);

        if (onlyValueMapper) {
          return mapper;
        }

        return `${keyPrefix} ${key} ${keyValueDelimiter} ${mapper}`;
      }
      case 'method': {
        if (!functions) {
          return undefined;
        }
        const mapper = valueMapper(code, 'function', typeParameter, key);

        if (onlyValueMapper) {
          return mapper;
        }

        return `${keyPrefix} ${mapper}`;
      }
      case 'getter': {
        if (!getters) {
          return undefined;
        }

        const mapper = valueMapper(code, 'getter', typeParameter, key);

        if (onlyValueMapper) {
          return mapper;
        }

        return `${keyPrefix} ${mapper}`;
      }
      case 'property': {
        if (!data) {
          return undefined;
        }
        const mapper = valueMapper(code, 'data', typeParameter, key);

        if (onlyValueMapper) {
          return mapper;
        }

        return `${keyPrefix} ${key}${type}${keyValueDelimiter} ${mapper}`;
      }
      default:
        break;
    }
  };

export const getMemberObjectString = (
  object: MorphoComponent['state'],
  userOptions: GetStateObjectStringOptions = {},
) => {
  const options = { ...DEFAULT_OPTIONS, ...userOptions };

  const lineItemDelimiter = options.format === 'object' ? ',' : '\n';

  const stringifiedProperties = Object.entries(object)
    .map(convertStateMemberToString(options))
    .filter((x) => x !== undefined)
    .join(lineItemDelimiter);

  const prefix = options.format === 'object' ? '{' : '';
  const suffix = options.format === 'object' ? '}' : '';

  // NOTE: we add a `lineItemDelimiter` at the very end because other functions will sometimes append more properties.
  // If the delimiter is a comma and the format is `object`, then we need to make sure we have an extra comma at the end,
  // or the object will become invalid JS.
  // We also have to make sure that `stringifiedProperties` isn't empty, or we will get `{,}` which is invalid
  const extraDelimiter = stringifiedProperties.length > 0 ? lineItemDelimiter : '';

  return `${prefix}${stringifiedProperties}${extraDelimiter}${suffix}`;
};

export const stringifyContextValue = (
  object: MorphoContext['value'],
  userOptions: GetStateObjectStringOptions = {},
) => getMemberObjectString(object, userOptions);

export const getStateObjectStringFromComponent = (
  component: MorphoComponent,
  options?: GetStateObjectStringOptions,
) => getMemberObjectString(component.state, options);
