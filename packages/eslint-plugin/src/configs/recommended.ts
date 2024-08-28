export default {
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@builder.io/morpho'],
  rules: {
    '@builder.io/morpho/css-no-vars': 'error',
    '@builder.io/morpho/jsx-callback-arg-name': 'error',
    '@builder.io/morpho/jsx-callback-arrow-function': 'error',
    '@builder.io/morpho/no-assign-props-to-state': 'error',
    '@builder.io/morpho/no-async-methods-on-state': 'error',
    '@builder.io/morpho/no-conditional-logic-in-component-render': 'error',
    '@builder.io/morpho/no-state-destructuring': 'error',
    '@builder.io/morpho/no-var-declaration-in-jsx': 'error',
    '@builder.io/morpho/no-var-declaration-or-assignment-in-component':
      'error',
    '@builder.io/morpho/no-var-name-same-as-state-property': 'error',
    '@builder.io/morpho/only-default-function-and-imports': 'error',
    '@builder.io/morpho/ref-no-current': 'error',
    '@builder.io/morpho/use-state-var-declarator': 'error',
  },
};
