import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: ["dist", "node_modules"]
    },
    {
        files: ["**/*.{js,ts,jsx,tsx,cjs,cts,mjs,mts}"],
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2022
            }
        }
    },
    eslintConfigPrettier
);
