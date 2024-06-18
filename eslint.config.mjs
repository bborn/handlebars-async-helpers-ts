import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

const rules =  {
  "@typescript-eslint/no-explicit-any": "warn",
}

export default [
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {rules}
];