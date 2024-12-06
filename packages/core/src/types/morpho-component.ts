import { Dictionary } from '../helpers/typescript';
import { Target } from './config';
import { JSONObject } from './json';
import { ComponentMetadata } from './metadata';
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
  importKind?: 'type' | 'typeof' | 'value' | null;
}

export type ReactivityType = 'normal' | 'reactive';

export type ContextOptions = {
  type?: ReactivityType;
};
export interface ContextGetInfo extends ContextOptions {
  name: string;
  path: string;
}
export interface ContextSetInfo extends ContextOptions {
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
  typeParameter?: string;
  type: StateValueType;
  propertyType?: ReactivityType;
};

export type MorphoState = Dictionary<StateValue | undefined>;

export type TargetBlock<Return, Targets extends Target = Target> = Partial<{
  [T in Targets | 'default']?: Return;
}>;

export type TargetBlockCode = TargetBlock<{
  code: string;
}>;

export type TargetBlockDefinition = TargetBlockCode & {
  settings: {
    requiresDefault: boolean;
  };
};

export type MorphoComponent = {
  '@type': '@builder.io/morpho/component';
  name: string;
  imports: MorphoImport[];
  exports?: MorphoExports;
  meta: JSONObject & {
    useMetadata?: ComponentMetadata;
  };
  inputs: MorphoComponentInput[];
  state: MorphoState;
  context: {
    get: Dictionary<ContextGetInfo>;
    set: Dictionary<ContextSetInfo>;
  };
  signals?: {
    signalTypeImportName?: string;
  };
  props?: {
    [name: string]: { propertyType: ReactivityType };
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
  targetBlocks?: Dictionary<TargetBlockDefinition>;
  children: MorphoNode[];
  subComponents: MorphoComponent[];
  types?: string[];
  propsTypeRef?: string;
  defaultProps?: MorphoState;
  style?: string;
};
