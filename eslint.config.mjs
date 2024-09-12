import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["*.ts", "*.tsx"],
    rules: {
      "@typescript-eslint/no-shadow": ["error"],
      "no-shadow": "off",
      "no-undef": "off"
    }
  },
  {
    "rules": {
      "comma-dangle": "off",
      "semi": "off",
      "no-param-reassign": "error",
      "no-duplicate-imports": "warn",
      "spaced-comment": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-extra-semi": "warn",
      "curly": "off",
      "no-var": "error",
      "no-void": "off",
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
  )
