import { MorphoConfig, Target } from '@builder.io/morpho';
import { checkIsDefined } from './nullable';

export const checkShouldOutputTypeScript = ({
  target,
  options,
}: {
  target: Target;
  options: MorphoConfig;
}): boolean => {
  const targetTsConfig = options.options[target]?.typescript;
  return checkIsDefined(targetTsConfig) ? targetTsConfig : false;
};
