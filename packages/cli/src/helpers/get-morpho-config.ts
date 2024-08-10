import { MorphoConfig } from '@builder.io/morpho';

export function getMorphoConfig(): MorphoConfig | null {
  const module = require(process.cwd() + '/morpho.config');
  return module?.default || module || null;
}
