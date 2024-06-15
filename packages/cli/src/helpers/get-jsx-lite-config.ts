import { JSXLiteConfig } from 'src/types/morpho-config'

export function getJsxLiteConfig(): JSXLiteConfig | null {
  const module = require(process.cwd() + '/morpho.config')
  return module?.default || module || null
}
