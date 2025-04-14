---
'@builder.io/morpho': patch
'@builder.io/morpho-cli': patch
---

[All] Add new `explicitBuildFileExtensions` to `MorphoConfig`. This allows users to manage the extension of some components explicitly. This is very useful for plugins:

```ts
  /**
   * Can be used for cli builds. Preserves explicit filename extensions when regex matches, e.g.:
   * {
   *   explicitBuildFileExtension: {
   *     ".ts":/*.figma.lite.tsx/g,
   *     ".md":/*.docs.lite.tsx/g
   *   }
   * }
   */
  explicitBuildFileExtensions?: Record<string, RegExp>;

```

[All] Add new `pluginData` object to `MorphoComponent` which will be filled during build via cli. Users get some additional information to use them for plugins:

```ts
  /**
   * This data is filled inside cli to provide more data for plugins
   */
pluginData?: {
    target?: Target;
    path?: string;
    outputDir?: string;
    outputFilePath?: string;
};
```
