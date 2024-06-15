import { MorphoConfig } from 'src/types/morpho-config'

export function getMorphoConfig(): MorphoConfig | null {
  const module = require(process.cwd() + '/morpho.config')
  return module?.default || module || null
}
