module.exports = {
  env: {
    commonjs: true,
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  ignorePatterns: [
    "node_modules/",
    "**/node_modules/",
    "/**/node_modules/*",
    "out/",
    "dist/",
    "build/",
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-var-requires": ["off"],
  },
};
