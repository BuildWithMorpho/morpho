import fs from 'fs';
import { MorphoConfig } from '@builder.io/morpho';

export function getMorphoConfig(): MorphoConfig | null {
  const path = process.cwd() + '/morpho.config';

  if (fs.existsSync(path)) {
    const module = require(path);
    return module?.default || module || null;
  }

  return null;
}
