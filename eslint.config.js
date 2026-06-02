import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default defineConfig([
	{ ignores: ['dist/*', 'node_modules/*'] },
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		plugins: { js },
		extends: ['js/recommended'],
	},
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		languageOptions: { globals: globals.node },
	},
	tseslint.configs.recommended,
	{
		plugins: { 'simple-import-sort': simpleImportSort },
		rules: {
			'prefer-const': 'warn',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'simple-import-sort/imports': 'error',
		},
	},
	eslintConfigPrettier,
])
