module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": false
      }
    ],
    "@typescript-eslint/await-thenable": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/unbound-method":"off",
    "@typescript-eslint/restrict-template-expressions":"off",
    "@typescript-eslint/no-floating-promises":"off",
    "@typescript-eslint/no-unused-vars":"off",
    "@typescript-eslint/no-explicit-any":"off"
  },
  
};