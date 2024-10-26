/**
 * @type {import('@builder.io/morpho').MorphoConfig}
 */
module.exports = {
  files: 'src/**',
  targets: ['react', 'svelte'],
  options: {
    react: {
      typescript: false,
    },
    svelte: {
      typescript: true,
    },
  },
};
