module.exports = {
	root: true,
	env: {
		es6: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:import/typescript",
		"plugin:@typescript-eslint/recommended",
		"google",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: ["./tsconfig.json", "./tsconfig.dev.json"],
		sourceType: "module",
		tsconfigRootDir: __dirname, // Important for functions
	},
	ignorePatterns: ["/lib/**/*", "/generated/**/*"],
	plugins: ["@typescript-eslint", "import"],
	rules: {
		quotes: ["error", "double"],
		"import/no-unresolved": "off",
		indent: ["error", 2],
		"@typescript-eslint/no-unused-expressions": "off",
	},
};
