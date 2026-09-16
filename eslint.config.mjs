import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";
import path from "node:path";

const compat = new FlatCompat({ baseDirectory: path.dirname(fileURLToPath(import.meta.url)) });
const config = [
  { ignores: [".next/**", "node_modules/**", "public/**"] },
  ...compat.extends("next/core-web-vitals"),
  { rules: { "no-unused-vars": ["warn", { argsIgnorePattern: "^_", caughtErrors: "none" }] } }
];
export default config;
