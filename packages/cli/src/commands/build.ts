import { GluegunCommand } from 'gluegun';
import { build } from '../build/build';
import { getMorphoConfig } from '../helpers/get-morpho-config';

const command: GluegunCommand = {
  name: 'build',
  alias: 'b',
  run: async (toolbox) => {
    const { parameters } = toolbox;
    const opts = parameters.options;
    const configRelPath = opts.config ?? opts.c;
    await build(getMorphoConfig(configRelPath));
  },
};

module.exports = command;
