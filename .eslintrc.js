const path = require('path');

/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es6: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			experimentalObjectRestSpread: true,
			warnOnUnsupportedTypeScriptVersion: false,
		},
		ecmaVersion: 7,
		project: path.join(__dirname, "tsconfig.json"),
		sourceType: 'module',
	},
	plugins: [
		'@typescript-eslint',
		'regexp',
		'import',
		'prettier',
	],
	settings: {
		"import/parsers": {
			"@typescript-eslint/parser": [".ts", ".tsx"]
		},
		"import/resolver": {
			"typescript": {
				"alwaysTryTypes": true
			}
		},
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:regexp/recommended',
		'plugin:import/errors',
		'plugin:import/typescript',
		'plugin:import/warnings',
		'plugin:prettier/recommended',"@remix-run/eslint-config", "@remix-run/eslint-config/node"
	],
	rules: {
		'prettier/prettier': 'error',
		'no-console': 'off',
		'no-constant-condition': 'off',
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				varsIgnorePattern: 'UU',
				args: 'none',
			},
		],
		'no-useless-catch': 'off',
		quotes: 'off',
		semi: ['error', 'always'],
		curly: ['error', 'multi-line'],
		'import/named': 2,
		'import/order': ['error', {
			'newlines-between': 'always'
		}],
		'import/no-unresolved': ['warn'],
		'one-var': ['error', 'never'],
		'no-var': 'error',
		'padding-line-between-statements': [
			'error',
			{
				blankLine: 'always',
				prev: '*',
				next: 'return',
			},
			{
				blankLine: 'always',
				prev: ['const', 'let', 'var'],
				next: '*',
			},
			{
				blankLine: 'any',
				prev: ['const', 'let', 'var'],
				next: ['const', 'let', 'var'],
			},
			{
				blankLine: 'always',
				prev: ['block', 'block-like', 'if'],
				next: '*',
			},
			{
				blankLine: 'always',
				prev: '*',
				next: ['block', 'block-like', 'if'],
			},
			{
				blankLine: 'any',
				prev: 'export',
				next: '*',
			},
			{
				blankLine: 'any',
				prev: '*',
				next: 'export',
			},
		],
		'@typescript-eslint/indent': 'off',
		'@typescript-eslint/prefer-interface': 'off',
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/ban-ts-comment': 'warn',
		'@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/consistent-type-imports': [
			'error',
			{
				prefer: 'type-imports',
				disallowTypeAnnotations: true,
				fixStyle: 'separate-type-imports',
			},
		],
		'prefer-template': 'error',
	},
};
