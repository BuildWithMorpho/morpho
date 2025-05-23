import { describe, expect, test } from 'vitest';
import { componentToQwik, parseJsx } from '..';

const getRawFile = async (filePath: string) => {
  const code = await import(`${filePath}?raw`).then((x) => x.default as string);
  return { code, filePath: ['src', '__tests__', filePath].join('/') };
};

const file = getRawFile('./data/blocks/getter-state.raw.tsx');

describe('LOCAL', () => {
  /**
   * this test is for local development only, to conveniently iterate on one file/one generator.
   */
  test.skip('file', async () => {
    const { code, filePath } = await file;
    const morphoJSON = await parseJsx(code);

    const output = componentToQwik({})({
      component: morphoJSON,
      path: filePath,
    });

    expect(morphoJSON).toMatchSnapshot();
    expect(output).matchSnapshot();
  });
});
