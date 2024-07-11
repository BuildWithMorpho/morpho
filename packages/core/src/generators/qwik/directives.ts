import { MorphoNode } from '../../types/morpho-node';
import { INDENT, SrcBuilder, NL, WS, UNINDENT } from './src-generator';

export const DIRECTIVES: Record<
  string,
  (node: MorphoNode, blockFn: () => void) => void
> = {
  Show: (node: MorphoNode, blockFn: () => void) =>
    function(this: SrcBuilder) {
      const expr = node.bindings.when;
      if (this.isJSX) {
        this.emit('{', WS, INDENT, expr, WS, '?', NL);
      } else {
        this.emit(expr, WS, '?', INDENT, NL);
      }
      blockFn();
      if (this.isJSX) {
        this.emit(':', WS, 'null', UNINDENT, NL, '}', NL);
      } else {
        this.emit(':', WS, 'null', UNINDENT, NL);
      }
    },
};
