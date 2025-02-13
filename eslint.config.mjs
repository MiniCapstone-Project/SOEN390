import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginJest from "eslint-plugin-jest";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { 
      globals: { 
        ...globals.browser, 
        ...globals.jest 
      } 
    },
    settings: {  // ✅ Moved 'react' under settings
      react: {
        version: "detect"
      }
    },
    plugins: { 
      jest: pluginJest 
    },
    rules: {
      ...pluginJest.configs.recommended.rules
    }
  },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
];