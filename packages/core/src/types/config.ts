import type { ParseMorphoOptions } from '@/parsers/jsx';
import { targets } from '@/targets';
import type { MorphoComponent } from './morpho-component';
import { BaseTranspilerOptions, TranspilerGenerator } from './transpiler';
export type Format = 'esm' | 'cjs';
export type Language = 'js' | 'ts';
interface TranspilerOptions {
  format?: Format;
}

type Targets = typeof targets;
export type Target = keyof Targets;
export type GeneratorOptions = {
  [K in Target]: NonNullable<Parameters<Targets[K]>[0]> & {
    transpiler?: TranspilerOptions;
  };
};
export type generatorsOption = {
  [K in Target]: NonNullable<Targets[K]>;
};

export interface TargetContext {
  target: Target;
  generator: TranspilerGenerator<NonNullable<MorphoConfig['options'][Target]>>;
  outputPath: string;
}

export interface OutputFiles {
  outputDir: string;
  outputFilePath: string;
}

export type MorphoConfig = {
  generators?: generatorsOption;
  /**
   * Apply common options to all targets
   */
  commonOptions?: Omit<BaseTranspilerOptions, 'experimental'>;
  /**
   * List of targets to compile to.
   */
  targets: Target[];
  /**
   * The output directory. Defaults to `output`.
   */
  dest?: string;
  /**
   * globs of files to transpile. Defaults to `src/*`.
   */
  files?: string | string[];

  /**
   * Optional list of globs to exclude from transpilation.
   */
  exclude?: string[];
  /**
   * The directory where overrides are stored. The structure of the override directory must match that of the source code,
   * with each target having its own sub-directory: `${overridesDir}/${target}/*`
   * Defaults to `overrides`.
   */
  overridesDir?: string;
  /**
   * Dictionary of per-target configuration. For each target, the available options can be inspected by going to
   * `packages/core/src/generators/xxx/types.ts`.
   *
   * Example:
   *
   * ```js
   * options: {
   *   vue: {
   *     prettier: false,
   *     namePrefix: (path) => path + '-my-vue-code',
   *   },
   *   react: {
   *     stateType: 'builder';
   *     stylesType: 'styled-jsx'
   *     plugins: [myPlugin]
   *   }
   * }
   * ```
   */
  options: Partial<GeneratorOptions>;
  /**
   * Configure a custom parser function which takes a string and returns MorphoJSON
   * Defaults to the JSXParser of this project (src/parsers/jsx)
   */
  parser?: (code: string, path?: string) => MorphoComponent | Promise<MorphoComponent>;

  /**
   * Configure a custom function that provides the output path for each target.
   * If you provide this function, you must provide a value for every target yourself.
   */
  getTargetPath: ({ target }: { target: Target }) => string;

  /**
   * Provide options to the parser.
   */
  parserOptions?: {
    jsx: Partial<ParseMorphoOptions> & {
      /**
       * Path to your project's `tsconfig.json` file. Needed for advanced types parsing (e.g. signals).
       */
      tsConfigFilePath?: string;
    };
  };
};
