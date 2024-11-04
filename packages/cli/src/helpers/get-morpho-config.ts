import fs from 'fs';
import { resolve } from 'path';
import { MorphoConfig } from '@builder.io/morpho';

/**
 * @param relPath { string } the relative path from pwd to config-file
 */
export function getMorphoConfig(relPath?: string): MorphoConfig | null {
  const path = resolve(process.cwd(), relPath || 'morpho.config');
  if (fs.existsSync(path + '.js')) {
    const module = require(path + '.js');
    return module?.default || module || null;
  } else if (fs.existsSync(path + '.cjs')) {
    const module = require(path + '.cjs');
    return module?.default || module || null;
  }

  return null;
}
