import { GluegunCommand } from 'gluegun'
import { build } from '../build/build'
import { getMorphoConfig } from '../helpers/get-morpho-config'

const command: GluegunCommand = {
  name: 'build',
  alias: 'b',
  run: async toolbox => {
    await build(getMorphoConfig())
  }
}

module.exports = command
