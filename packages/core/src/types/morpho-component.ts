import { Dictionary } from '../helpers/typescript';
import { _JSON, JSONObject } from './json';
import { MorphoNode } from './morpho-node';

/**
 * @example
 *  // import core, { useState, someThing as someAlias } from '@builder.io/morpho'
 *  {
 *    path: '@builder.io/morpho',
 *    imports: {
 *      useState: 'useState',
 *      someAlias: 'someThing',
 *      core: 'default',
 *    }
 *  }
 *
 * @example
 *  // import * as core from '@builder.io/morpho'
 *  {
 *    path: '@builder.io/morpho',
 *    imports: {
 *      core: '*',
 *    }
 *  }
 */
export interface MorphoImport {
  path: string;
  imports: {
    [key: string]: string | undefined;
  };
}

export interface ContextGetInfo {
  name: string;
  path: string;
}
export interface ContextSetInfo {
  name: string;
  value?: MorphoState;
  ref?: string;
}

export type ContextGet = { [key: string]: ContextGetInfo };
export type ContextSet = { [key: string]: ContextSetInfo };

export type extendedHook = { code: string; deps?: string };

export type MorphoComponentInput = {
  name: string;
  defaultValue: any;
};

export type MorphoExport = {
  [name: string]: {
    code: string;
    usedInLocal?: boolean;
    isFunction?: boolean;
  };
};

export type StateValueType = 'function' | 'getter' | 'method' | 'property';

export type StateCode = _JSON;

type CodeValue = {
  code: string;
  type: Exclude<StateValueType, 'property'>;
};

export const checkIsCodeValue = (value: unknown): value is CodeValue => {
  return typeof value === 'object' &&
    value &&
    Object.keys(value).length === 2 &&
    'type' in value &&
    'code' in value
    ? ['function', 'getter', 'method'].includes((value as any).type)
    : false;
};

export type StateValue =
  | CodeValue
  | {
      code: StateCode;
      type: Extract<StateValueType, 'property'>;
    };

export type MorphoState = Dictionary<StateValue | undefined>;

export type MorphoComponent = {
  '@type': '@builder.io/morpho/component';
  name: string;
  imports: MorphoImport[];
  exports?: MorphoExport;
  meta: JSONObject & {
    useMetadata?: JSONObject;
  };
  inputs: MorphoComponentInput[];
  state: MorphoState;
  context: {
    get: ContextGet;
    set: ContextSet;
  };
  refs: {
    [useRef: string]: {
      typeParameter?: string;
      argument: string;
    };
  };
  hooks: {
    init?: extendedHook;
    onInit?: extendedHook;
    onMount?: extendedHook;
    onUnMount?: extendedHook;
    preComponent?: extendedHook;
    postComponent?: extendedHook;
    onUpdate?: extendedHook[];
  };
  children: MorphoNode[];
  subComponents: MorphoComponent[];
  types?: string[];
  propsTypeRef?: string;
  defaultProps?: JSONObject;
  style?: string;
};
