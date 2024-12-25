import globals from "globals";
import eslint from "@eslint/js";
import ts from "@typescript-eslint/parser";
import pluginTs from "@typescript-eslint/eslint-plugin";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  eslint.configs.recommended,
  reactRecommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: ts,
      parserOptions: {
        project: true,
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      "@typescript-eslint": pluginTs,
      "jsx-a11y": jsxA11y,
      "react-hooks": reactHooks,
    },
    rules: {
      ...pluginTs.configs["recommended-type-checked"].rules,
      ...pluginTs.configs["stylistic-type-checked"].rules,
        ...reactRecommended.rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/consistent-type-imports": "warn",
        "react/react-in-jsx-scope": "off",
        "react/jsx-uses-react": "off",
        "jsx-a11y/anchor-is-valid": "off",
        "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
        "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
    },
  },
];
