import { MorphoConfig, Target } from '@builder.io/morpho';

/**
 * Output generated component file, before it is minified and transpiled into JS.
 */
export const checkShouldOutputTypeScript = ({
  target,
  options,
}: {
  target: Target;
  options: MorphoConfig;
}): boolean => {
  return !!options.options[target]?.typescript
    ? options.options[target].typescript
    : options.commonOptions?.typescript;
};
