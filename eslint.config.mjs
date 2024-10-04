// @ts-check
import eslint from "@eslint/js";
import perfectionist from 'eslint-plugin-perfectionist';
import ts from "typescript-eslint";

export default ts.config(
  {
    ignores: ["docs"]
  },
  eslint.configs.recommended,
  ...ts.configs.strictTypeChecked,
  ...ts.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      }
    }
  },
  perfectionist.configs["recommended-natural"]
)