import { JSON, JSONObject } from './json';
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

type ContextInfo = { name: string; path: string };

export type extendedHook = { code: string; deps?: string };

export type MorphoComponentInput = {
  name: string;
  defaultValue: any;
};

export type MorphoComponent = {
  '@type': '@builder.io/morpho/component';
  name: string;
  imports: MorphoImport[];
  meta: JSONObject & {
    useMetadata?: JSONObject;
    // TO-DO: remove this? seems to be legacy/outdated, and superseeded by `useMetadata`
    metadataHook?: JSONObject;
  };
  inputs: MorphoComponentInput[];
  state: JSONObject;
  context: {
    get: { [key: string]: ContextInfo };
    set: { [key: string]: { name: string; value?: JSONObject } }; // TODO: support non object values
  };
  hooks: {
    init?: extendedHook;
    onMount?: extendedHook;
    onUnMount?: extendedHook;
    preComponent?: extendedHook;
    postComponent?: extendedHook;
    onUpdate?: extendedHook;
  };
  children: MorphoNode[];
  subComponents: MorphoComponent[];
};
