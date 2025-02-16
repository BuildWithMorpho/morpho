import { rules } from '../rules';

const PLUGIN_NAME = '@builder.io/morpho' as const;

type RulesKeys = `${typeof PLUGIN_NAME}/${keyof typeof rules}`;

const recommendedRules: Record<RulesKeys, 'error' | 'warn' | 'off' | 0 | 1 | 2> = {
  '@builder.io/morpho/css-no-vars': 'error',
  '@builder.io/morpho/jsx-callback-arg-name': 'error',
  '@builder.io/morpho/jsx-callback-arrow-function': 'error',
  '@builder.io/morpho/no-assign-props-to-state': 'error',
  '@builder.io/morpho/no-async-methods-on-state': 'error',
  '@builder.io/morpho/no-conditional-logic-in-component-render': 'error',
  '@builder.io/morpho/no-state-destructuring': 'error',
  '@builder.io/morpho/no-var-declaration-in-jsx': 'error',
  '@builder.io/morpho/no-var-declaration-or-assignment-in-component': 'error',
  '@builder.io/morpho/no-var-name-same-as-state-property': 'error',
  '@builder.io/morpho/only-default-function-and-imports': 'error',
  '@builder.io/morpho/ref-no-current': 'error',
  '@builder.io/morpho/use-state-var-declarator': 'error',
  '@builder.io/morpho/static-control-flow': 'error',
  '@builder.io/morpho/no-var-name-same-as-prop-name': 'error',
  '@builder.io/morpho/no-map-function-in-jsx-return-body': 'warn',
  '@builder.io/morpho/no-setter-with-same-name-as-state-prop': 'error',
};

export default {
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [PLUGIN_NAME],
  rules: recommendedRules,
};
