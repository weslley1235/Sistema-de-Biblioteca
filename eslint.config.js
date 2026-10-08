import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['node_modules/'] },
  js.configs.recommended,
  {
    files: ['server.js', 'backend/**/*.js', 'banco/**/*.js'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['front/**/*.js'],
    languageOptions: { globals: globals.browser },
  },
  prettier,
];
