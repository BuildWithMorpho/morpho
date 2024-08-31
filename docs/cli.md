# CLI

We currently have two CLI commands: `morpho build` and `morpho compile`.

## `morpho compile`

`morpho compile` is a relatively straightforward command. It:

- Reads the config in `morpho.config.js`
- Receives 1 Morpho component file as input
- Outputs it to 1 designated target.

## `morpho build`

`morpho build` is meant for entire project/folders, and is therefore more involved. It:

- Reads the config in `morpho.config.js`
- Identifies a source folder
- Reads _all_ Morpho files in the source folder, and
  - Outputs a component for each target in the config
  - Performs additional transpilation steps on a per-target basis
- Reads _all_ non-Morpho JS/TS files in the project, and
  - transpiles them as-is to JS
- Performs necessary transformations to both Morpho & non-Morpho files so that the output folder is coherent and valid (like renaming all component imports in a Svelte target such that they match the output name, ending in `.svelte`)
