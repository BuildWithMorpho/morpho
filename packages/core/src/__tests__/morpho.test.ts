import { componentToMorpho } from '@/generators/morpho';
import { createMorphoComponent } from '@/helpers/create-morpho-component';
import { createMorphoNode } from '@/helpers/create-morpho-node';
import { runTestsForTarget } from './test-generator';

describe('Morpho, format: legacy', () => {
  runTestsForTarget({
    options: { format: 'legacy' },
    target: 'morpho',
    generator: componentToMorpho,
  });
});

describe('Morpho, format: legacy (native loops and conditionals)', () => {
  runTestsForTarget({
    options: {
      format: 'legacy',
      nativeLoops: true,
      nativeConditionals: true,
      returnArray: true,
    },
    target: 'morpho',
    generator: componentToMorpho,
  });
});

describe('Morpho, format: react', () => {
  runTestsForTarget({
    options: {
      format: 'react',
    },
    target: 'morpho',
    generator: componentToMorpho,
  });
});

describe('Can encode <> in text', () => {
  it('should encode <> in text', () => {
    const result = componentToMorpho()({
      component: createMorphoComponent({
        children: [
          createMorphoNode({
            properties: { _text: '<>{}' },
          }),
        ],
        hooks: {},
      }),
    });

    expect(result).toMatchSnapshot();
  });
  it('should not encode valid jsx', () => {
    const result = componentToMorpho()({
      component: createMorphoComponent({
        children: [
          createMorphoNode({
            properties: { _text: 'hello <b>world</b>' },
          }),
        ],
        hooks: {},
      }),
    });

    expect(result).toMatchSnapshot();
  });
});
