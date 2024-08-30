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
  value?: JSONObject;
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

export type MorphoComponent = {
  '@type': '@builder.io/morpho/component';
  name: string;
  imports: MorphoImport[];
  exports?: MorphoExport;
  meta: JSONObject & {
    useMetadata?: JSONObject;
  };
  inputs: MorphoComponentInput[];
  state: JSONObject;
  context: {
    get: ContextGet;
    set: ContextSet;
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
};
