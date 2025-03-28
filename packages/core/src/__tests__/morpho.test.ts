import { componentToMorpho } from '@/generators/morpho';
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
