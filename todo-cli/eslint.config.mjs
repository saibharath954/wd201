import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.browser, ...globals.node },
      ecmaVersion: "latest",
    },
    env: {
      commonjs: true,
      es2021: true,
      node: true,
      jest: true,
    },
    extends: ["eslint:recommended", pluginJs.configs.recommended],
    rules: {
      // Place any custom rules here
    },
    overrides: [
      // Define any specific overrides for certain files or directories here
    ],
  },
];
