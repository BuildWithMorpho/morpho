/**
 * @type {import('@builder.io/morpho').MorphoConfig}
 */
module.exports = {
  files: 'src/**',
  targets: ['qwik', 'react', 'svelte'],
  dest: 'packages',
  commonOptions: {
    typescript: true,
  },
  options: {
    react: {
      stylesType: 'style-tag',
    },
    svelte: {},
    qwik: {},
  },
};
