In the root of the project you run `morpho` from, you can add a `morpho.config.js` file that will be read by Morpho. Checkout [the types](/packages/core/src/types/config.ts) for what settings you can provide.

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

More example see [e2e-app](../packages/e2e-app/tsconfig.json)
