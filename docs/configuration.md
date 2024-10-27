# Configuration

## Morpho Configuration

In the root of the project, from which you run morpho, you can add a `morpho.config.js` file that will be read by Morpho. You can also specify a config file by option: `--config=<file>`.

The `morpho.config.js` file can take the following shape:

````typescript

type MorphoConfig = {
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
   * `packages/core/src/targets.ts` and looking at the first argument of the desired generator.
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
````

The `Targets` type can be any one of, or an array of the following strings:

```typescript
type targets =
  | 'alpine'
  | 'angular'
  | 'customElement'
  | 'html'
  | 'morpho'
  | 'liquid'
  | 'react'
  | 'reactNative'
  | 'solid'
  | 'svelte'
  | 'swift'
  | 'template'
  | 'webcomponent'
  | 'vue'
  | 'vue2'
  | 'vue3'
  | 'stencil'
  | 'qwik'
  | 'marko'
  | 'preact'
  | 'lit'
  | 'rsc';
```

Note that you can configure each target generator individually, providing plugins on a case-by-case basis.

### TypeScript configuration

TypeScript includes a full-fledged JSX compiler. Add the following configuration to your tsconfig.json to transpile JSX to morpho-compatible JavaScript:

```js
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "@builder.io/morpho",
    // other config here
  }
}
```

For an example of TS configuration, look at our [basic example](../examples/basic/tsconfig.json)'s `tsconfig.json`.
