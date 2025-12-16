import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";

export default [
  js.configs.recommended,
  prettier,
  {
    files: ["**/*.js"],
    ignores: ["node_modules", "dist"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
        console: "readonly",
      },
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": "warn",
      "prettier/prettier": "error",
    },
  },
];
