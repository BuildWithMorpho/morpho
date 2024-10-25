import { createMorphoNode } from '../helpers/morpho-node';
import { parseChildren } from '../helpers/children';

import type { TemplateNode } from 'svelte/types/compiler/interfaces';
import type { SveltosisComponent } from '../types';
import { MorphoNode } from '../../../types/morpho-node';
import { createSingleBinding } from '../../../helpers/bindings';

export function parseEach(json: SveltosisComponent, node: TemplateNode): MorphoNode {
  return {
    ...createMorphoNode(),
    name: 'For',
    scope: { forName: node.context.name },
    bindings: {
      each: createSingleBinding({
        code: node.expression.name,
      }),
    },
    children: parseChildren(json, node),
  };
}
