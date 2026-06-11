import base from '../../packages/config/eslint/base.mjs';

export default [
  ...base,
  {
    ignores: ['.next/**', 'out/**'],
  },
];
