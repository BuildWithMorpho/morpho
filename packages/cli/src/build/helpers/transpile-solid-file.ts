import * as babel from '@babel/core';
import { MorphoComponent } from '@builder.io/morpho';

const tsPreset = require('@babel/preset-typescript');

export type TranspileSolidFileOptions = {
  path: string;
  contents: string;
  morphoComponent: MorphoComponent;
};

// TO-DO: can this be replaced with esbuild `transpile` helper
export async function transpileSolidFile(options: TranspileSolidFileOptions) {
  return (
    babel
      .transform(options.contents, {
        filename: 'file.tsx',
        presets: [tsPreset],
      })
      .code // Remove .lite extensions from imports without having to load a slow parser like babel
      // E.g. convert `import { foo } from './block.lite';` -> `import { foo } from './block';`
      .replace(/\.lite(['"];)/g, '$1')
  );
}
