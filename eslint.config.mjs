import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import jestPlugin from "eslint-plugin-jest";
import prettierConfig from "eslint-config-prettier";

export default [
  // Ignore generated output and non-source directories
  {
    ignores: ["build/**", "node_modules/**"]
  },

  // Source files
  {
    files: ["src/**/*.js"],
    plugins: {
      react: reactPlugin,
      "jsx-a11y": jsxA11y
    },
    languageOptions: {
      ecmaVersion: 2022,
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
      "react/prop-types": "warn",
      "react/react-in-jsx-scope": "warn",
      "react/self-closing-comp": "warn",
      "react/sort-comp": "warn",
      "react/sort-prop-types": "warn"
    }
  },

  // Test files — guard against silently disabled or focused tests
  {
    files: ["src/**/*.test.js", "src/**/__tests__/**/*.js"],
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
