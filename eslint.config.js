// @ts-check

import { eslintConfig } from '@cosing/lint';

export default eslintConfig();

// import antfu from '@antfu/eslint-config';
// import globals from 'globals';
// // import autoImport from './.eslintrc-auto-import.js'
// export default antfu(
//   // 针对antfu配置的配置选项
//   {
//     typescript: true,
//     vue: true,
//     languageOptions: {
//       // globals: autoImport?.globals,
//       globals: globals.browser
//     },
//     ignores: [
//       'types/auto-imports.d.ts',
//       'types/components.d.ts',
//       'public',
//       'tsconfig.*.json',
//       'tsconfig.json',
//       'node_modules',
//       'dist',
//       '**/.gitbub',
//       '**/.nitro'
//     ]
//   },
//   // ESLint扁平化配置，
//   {
//     rules: {
//       'no-console': 'off',
//       'semi': ['error', 'always'], // 强制使用分号
//       'style/semi': 'off', // 强制使用分号
//       'style/quote-props': 'off',
//       'unused-imports/no-unused-vars': 'off',
//       'ts/no-unused-expressions': 'off',
//       'comma-dangle': ['error', 'never'], // 禁止最后一个元素后面加逗号
//       'style/comma-dangle': 'off' // 禁止最后一个元素后面加逗号
//     }
//   },
//   {
//     files: ['**/*.json'],
//     rules: {
//       'comma-dangle': ['error', 'never'], // 禁止最后一个元素后面加逗号
//       'style/comma-dangle': 'off' // 禁止最后一个元素后面加逗号
//     }
//   }
// );
