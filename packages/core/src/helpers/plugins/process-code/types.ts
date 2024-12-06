import { MorphoComponent } from '../../../types/morpho-component';
import { MorphoNode } from '../../../types/morpho-node';

export type CodeType =
  | 'hooks'
  | 'hooks-deps'
  | 'bindings'
  | 'properties'
  | 'state'
  | 'types'
  | 'context-set'
  // this is for when we write dynamic JSX elements like `<state.foo>Hello</state.foo>` in Morpho
  | 'dynamic-jsx-elements';

// declare function codeProcessor<T extends CodeType>(
//   codeType: T,
//   json: MorphoComponent,
// ): (code: string, hookType: T extends 'hooks' ? keyof MorphoComponent['hooks'] : string) => string;
declare function codeProcessor(
  codeType: CodeType,
  json: MorphoComponent,
  node?: MorphoNode,
): (code: string, hookType: string) => string | (() => void);

export type CodeProcessor = typeof codeProcessor;
