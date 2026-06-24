import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import jestPlugin from "eslint-plugin-jest";
import prettierConfig from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default [
  // Ignore generated output and non-source directories
  {
    ignores: ["build/**", "node_modules/**"]
  },

  // Source files — both the remaining JS and the migrated TS/TSX. The
  // typescript-eslint parser handles plain JS and JSX too, so a single block
  // covers every source extension during (and after) the prop-types → TS
  // migration (issue #172).
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11y,
      "@typescript-eslint": tseslint.plugin
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2025,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true }
      },
      globals: {
        ...globals.browser,
        ...globals.es2020
      }
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      // Core rules preserved from .eslintrc
      "linebreak-style": ["error", "unix"],

      // Hooks rules — only the two classic guards; the v7 preset bundles
      // experimental React Compiler rules that are not appropriate here
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React rules — exact translation from .eslintrc
      // (severity 0 = off are omitted; 1 = warn)
      "react/jsx-no-duplicate-props": "warn",
      "react/jsx-no-undef": "warn",
      "react/jsx-uses-react": "warn",
      "react/jsx-uses-vars": "warn",
      "react/no-danger": "warn",
      "react/no-did-mount-set-state": "warn",
      "react/no-did-update-set-state": "warn",
      "react/no-direct-mutation-state": "warn",
      "react/no-multi-comp": "warn",
      "react/no-unknown-property": "warn",
      // prop-types is being removed in favour of TypeScript types (issue #172),
      // so the runtime prop-types lint rules no longer apply.
      "react/prop-types": "off",
      "react/sort-prop-types": "off",
      "react/react-in-jsx-scope": "warn",
      "react/self-closing-comp": "warn",
      "react/sort-comp": "warn",

      // Let the TS-aware unused-vars rule supersede core no-unused-vars for the
      // migrated files (off by default here to avoid churn during stage one).
      "no-unused-vars": "off"
    }
  },

  // Test files — guard against silently disabled or focused tests
  {
    files: ["src/**/*.test.{js,jsx,ts,tsx}", "src/**/__tests__/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      jest: jestPlugin
    },
    languageOptions: {
      globals: globals.jest
    },
    rules: {
      "jest/no-disabled-tests": "error",
      "jest/no-focused-tests": "error"
    }
  },

  // Prettier must be last — disables all formatting rules that conflict
  prettierConfig
];
