import { BaseTranspilerOptions } from '@/types/transpiler';

export interface ToMorphoOptions extends BaseTranspilerOptions {
  format: 'react' | 'legacy';
  nativeConditionals?: boolean;
  nativeLoops?: boolean;
  returnArray?: boolean;
}

export type MorphoMetadata = {};
