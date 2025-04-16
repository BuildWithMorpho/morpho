import { OutputFiles, TargetContext } from '@/types/config';
import { MorphoComponent } from './morpho-component';

export type MorphoBuildPlugin = (
  targetContext: TargetContext,
  files?: {
    componentFiles: OutputFiles[];
    nonComponentFiles: OutputFiles[];
  },
) => void | Promise<void>;

export type MorphoJsonPlugin = (json: MorphoComponent) => MorphoComponent | void;

export type MorphoCodePlugin = (code: string, json: MorphoComponent) => string;

export type MorphoHook<T> = {
  pre?: T;
  post?: T;
};

export type MorphoPlugin = (options?: any) => {
  name?: string;
  order?: number;
  // Happens before/after build
  build?: MorphoHook<MorphoBuildPlugin>;
  // Happens before/after any modifiers
  json?: MorphoHook<MorphoJsonPlugin>;
  // Happens before/after formatting
  code?: MorphoHook<MorphoCodePlugin>;
};
