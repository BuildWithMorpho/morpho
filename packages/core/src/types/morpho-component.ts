import { Dictionary } from '../helpers/typescript';
import { JSONObject } from './json';
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

export type extendedHook = { code: string; deps?: string };

export type MorphoComponentInput = {
  name: string;
  defaultValue: any;
};

export type MorphoExports = {
  [name: string]: MorphoExport;
};

export interface MorphoExport {
  code: string;
  usedInLocal?: boolean;
  isFunction?: boolean;
}

export type StateValueType = 'function' | 'getter' | 'method' | 'property';

export type StateValue = {
  code: string;
  type: StateValueType;
  typeParameter?: string;
};

export type MorphoState = Dictionary<StateValue | undefined>;

export type MorphoComponent = {
  '@type': '@builder.io/morpho/component';
  name: string;
  imports: MorphoImport[];
  exports?: MorphoExports;
  meta: JSONObject & {
    useMetadata?: JSONObject;
  };
  inputs: MorphoComponentInput[];
  state: MorphoState;
  context: {
    get: Dictionary<ContextGetInfo>;
    set: Dictionary<ContextSetInfo>;
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
  defaultProps?: MorphoState;
  style?: string;
};
