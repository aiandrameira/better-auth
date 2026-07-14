import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import unusedImports from "eslint-plugin-unused-imports";
import { dirname } from "path";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
    {
        ignores: ["dist", "node_modules", ".angular"],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: ["./tsconfig.app.json"],
                tsconfigRootDir: __dirname,
                ecmaVersion: 2020,
                sourceType: "module",
            },
            globals: {
                console: "readonly",
                window: "readonly",
                document: "readonly",
                navigator: "readonly",
            },
        },
        plugins: {
            prettier: prettierPlugin,
            "unused-imports": unusedImports,
            "@typescript-eslint": tseslint.plugin,
        },
        rules: {
            "prettier/prettier": [
                "error",
                {
                    semi: true,
                    singleQuote: false,
                    printWidth: 120,
                    tabWidth: 4,
                },
            ],
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "warn",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-function-return-types": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "no-debugger": "warn",
        },
    },
    prettier,
];
