import * as babel from '@babel/core';
import { MorphoComponent } from '@builder.io/morpho';
import dedent from 'dedent';
import * as json5 from 'json5';

const tsPreset = require('@babel/preset-typescript');
const solidPreset = require('babel-preset-solid');

export type TranspileSolidFileOptions = {
  path: string;
  contents: string;
  morphoComponent: MorphoComponent;
};

export async function transpileSolidFile(options: TranspileSolidFileOptions) {
  let str = babel
    .transform(options.contents, {
      filename: 'file.tsx',
      presets: [tsPreset, solidPreset],
    })
    .code // Remove .lite extensions from imports without having to load a slow parser like babel
    // E.g. convert `import { foo } from './block.lite';` -> `import { foo } from './block';`
    .replace(/\.lite(['"];)/g, '$1');

  const registerComponentHook = options.morphoComponent.meta.registerComponent;
  if (registerComponentHook) {
    str += dedent`
      import { registerComponent } from '../functions/register-component';
      registerComponent(${options.morphoComponent.name}, ${json5.stringify(
      registerComponentHook,
    )});
    `;
  }

  return str;
}
