# Morpho Mono-repo Starter

This is a mono-repo for Morpho libraries. It contains a few workspaces to get you started.

## Workspaces

- [library](./library/): workspace containing your Morpho project.
  - [library/src](./library/src/): Morpho source code of your component library.
  - [library/packages](./library/packages/): individual outputs generated by Morpho.
- [test-apps](./test-apps/): dev servers that import your Morpho components. Useful for testing your library.

## Developing

1. Run Morpho in watch mode

```bash
cd library
npm run start
```

2. If the output has its own bundling step (like Svelte/Qwik), you will need to run that build step in a separate terminal:

```bash
cd library/packages/qwik
npm run build:watch
```

3. Finally, run the corresponding test server of your library from the previous step to see your Morpho project in action:

```bash
cd test-apps/qwik
npm run dev
```

## Next up

If you want to add more outputs, or configure Morpho in any way, you will need to update the `morpho.config.js` file in the root of your project.
Check [our configuration docs](/docs/configuration.md) for how to setup the Morpho config file.
