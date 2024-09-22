import fs from 'fs';
import { resolve } from 'path';
import { MorphoConfig } from '@builder.io/morpho';

/**
 * @param relPath { string } the relative path from pwd to config-file
 */
export function getMorphoConfig(relPath?: string): MorphoConfig | null {
  const path = resolve(process.cwd(), relPath || 'morpho.config.js');
  if (fs.existsSync(path)) {
    const module = require(path);
    return module?.default || module || null;
  }

  return null;
}
