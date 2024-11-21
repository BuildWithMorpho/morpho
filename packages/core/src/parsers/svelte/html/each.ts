import { parseChildren } from '../helpers/children';
import { createMorphoNode } from '../helpers/morpho-node';

import type { TemplateNode } from 'svelte/types/compiler/interfaces';
import { createSingleBinding } from '../../../helpers/bindings';
import { MorphoNode } from '../../../types/morpho-node';
import type { SveltosisComponent } from '../types';

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
