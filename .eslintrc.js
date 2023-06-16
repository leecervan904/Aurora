module.exports = {
  extends: [
    // '@antfu/eslint-config-ts',
    '@antfu/eslint-config-react',
  ],
  overrides: [
    {
      files: ['*.json', '*.json5', '*.jsonc'],
      rules: {
        'quote-props': 'off',
        '@typescript-eslint/comma-dangle': 'off',
        '@typescript-eslint/quotes': 'off',
      },
    },
  ],
  rules: {
    'no-console': 'warn',

    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',

    // Nest
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-throw-literal': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
  },
}
