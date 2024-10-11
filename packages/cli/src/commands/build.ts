import { GluegunCommand, GluegunParameters } from 'gluegun';
import { MorphoConfig, Target } from '@builder.io/morpho';
import { build } from '../build/build';
import { getMorphoConfig } from '../helpers/get-morpho-config';

const getTargets = (morphoConfig: MorphoConfig, cliOpts: GluegunParameters['options']) => {
  const targetsFromCli: Target[] = (cliOpts.targets || '').split(',');
  const excludeTargetsMap: Record<Target, true> = (cliOpts.excludeTargets || '')
    .split(',')
    .reduce((accu, t) => {
      accu[t] = true;
      return accu;
    }, {});

  const targets = Array.from(new Set([...morphoConfig.targets, ...targetsFromCli])).filter(
    (t) => t && !excludeTargetsMap[t],
  );
  return targets;
};

const command: GluegunCommand = {
  name: 'build',
  alias: 'b',
  run: async (toolbox) => {
    const { parameters } = toolbox;
    const opts = parameters.options;
    const configRelPath = opts.config ?? opts.c;
    const config = getMorphoConfig(configRelPath);
    if (!config) {
      throw new Error(`No config file found for Morpho.`);
    }
    const targets = getTargets(config, opts);
    await build({
      ...config,
      targets,
    });
  },
};

module.exports = command;
