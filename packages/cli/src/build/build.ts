import {
  componentToReact,
  componentToReactNative,
  componentToSolid,
  componentToVue,
  MorphoComponent,
  parseJsx,
} from '@builder.io/morpho';
import { outputFile, readFile, remove } from 'fs-extra';
import { compileVueFile } from './helpers/compile-vue-file';
import { transpile } from './helpers/transpile';
import dedent from 'dedent';
import * as json5 from 'json5';
import { transpileSolidFile } from './helpers/transpile-solid-file';
import glob from 'fast-glob';
import { MorphoConfig, Target } from '../types/morpho-config';
import { flatten } from 'lodash'

const cwd = process.cwd();

export async function build(options?: MorphoConfig) {
  const config: MorphoConfig = {
    targets: [],
    dest: 'dist',
    files: 'src/*',
    ...options
  }

  await clean();

  const tsLiteFiles = await Promise.all(
    (await glob(flatten([config.files, `**/*.lite.tsx`]), { cwd })).map(async path => ({
      path,
      morphoJson: parseJsx(await readFile(path, 'utf8'), {
        jsonHookNames: ['registerComponent'],
      }),
    }))
  );

  await Promise.all(
    config.targets.map(async target => {
      const jsFiles = await buildTsFiles(target);
      await Promise.all([outputTsFiles(target, jsFiles), outputTsxLiteFiles(target, tsLiteFiles, config)]);
      await outputOverrides(target, config);
    })
  );
}

async function clean() {
  const files = await glob('output/*/src/**/*');
  await Promise.all(
    files.map(async file => {
      await remove(file);
    })
  );
}

async function outputOverrides(target: Target, options: MorphoConfig) {
  const files = await glob([`overrides/${target}/**/*`, `!overrides/${target}/node_modules/**/*`]);
  await Promise.all(
    files.map(async file => {
      let contents = await readFile(file, 'utf8');

      const esbuildTranspile = file.match(/\.tsx?$/);
      if (esbuildTranspile) {
        contents = await transpile({ path: file, target });
      }

      await outputFile(
        file.replace('overrides/', `${options.dest}/`).replace(/\.tsx?$/, '.js'),
        contents
      );
    })
  );
}

async function outputTsxLiteFiles(
  target: Target,
  files: { path: string; morphoJson: MorphoComponent }[],
  options: MorphoConfig
) {
  const output = files.map(async ({ path, morphoJson }) => {
    let transpiled =
      target === 'reactNative'
        ? componentToReactNative(morphoJson, {
            stateType: 'useState',
          })
        : target === 'vue'
        ? componentToVue(morphoJson)
        : target === 'react'
        ? componentToReact(morphoJson)
        : target === 'solid'
        ? componentToSolid(morphoJson)
        : (null as never);

    const original = transpiled;

    const solidTranspile = target === 'solid';
    if (solidTranspile) {
      transpiled = await transpileSolidFile({
        contents: transpiled,
        path,
        morphoComponent: morphoJson,
      });
    }

    const esbuildTranspile = target === 'reactNative' || target === 'react';
    if (esbuildTranspile) {
      transpiled = await transpile({ path, content: transpiled, target });
      const registerComponentHook = morphoJson.meta.registerComponent;
      if (registerComponentHook) {
        transpiled = dedent`
          import { registerComponent } from '../functions/register-component';

          ${transpiled}

          registerComponent(${morphoJson.name}, ${json5.stringify(registerComponentHook)});
        
        `;
      }
    }
    const vueCompile = target === 'vue';
    if (vueCompile) {
      const files = await compileVueFile({
        distDir: options.dest,
        contents: transpiled,
        path,
        morphoComponent: morphoJson,
      });
      await Promise.all(files.map(file => outputFile(file.path, file.contents)));
    } else {
      return await Promise.all([
        outputFile(`${options.dest}/${target}/${path.replace(/\.lite\.tsx$/, '.js')}`, transpiled),
        outputFile(`${options.dest}/${target}/${path.replace(/\.original\.jsx$/, '.js')}`, original),
      ]);
    }
  });
  await Promise.all(output);
}

async function outputTsFiles(target: Target, files: { path: string; output: string }[], options?: MorphoConfig) {
  const output = files.map(({ path, output }) => {
    return outputFile(`${options.dest}/${target}/${path.replace(/\.tsx?$/, '.js')}`, output);
  });
  await Promise.all(output);
}

async function buildTsFiles(target: Target, options?: MorphoConfig) {
  const tsFiles = await glob(`src/**/*.ts`, {
    cwd: cwd,
  });

  return await Promise.all(
    tsFiles.map(async path => {
      const output = await transpile({ path, target });

      return {
        path,
        output,
      };
    })
  );
}

if (require.main === module) {
  build().catch(console.error);
}
