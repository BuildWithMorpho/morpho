import { BaseTranspilerOptions } from '@/types/transpiler';

export interface ToMorphoOptions extends BaseTranspilerOptions {
  format: 'react' | 'legacy';
}

export type MorphoMetadata = {};
