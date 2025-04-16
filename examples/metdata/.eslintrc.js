module.exports = {
  env: {
    browser: true,
  },
  plugins: ["@builder.io/morpho"],
  parser: "@typescript-eslint/parser",
  extends: [],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "@builder.io/morpho/no-conditional-render": "warn",
  },
};
