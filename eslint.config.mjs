import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const rootDir = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: rootDir });

// Feature folders are read from disk, so a feature created by /new-feature is covered at once.
const features = readdirSync(join(rootDir, "src/features"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const adminImportRestriction = {
  group: ["@/core/db/admin", "**/db/admin"],
  message: "The admin client bypasses RLS. Import it only from a feature's server/ folder.",
};

function crossFeatureRestrictions(ownFeature) {
  return features
    .filter((other) => other !== ownFeature)
    .map((other) => ({
      group: [`@/features/${other}`, `@/features/${other}/**`, `!@/features/${other}/contract`],
      message: `Features talk to each other only through contract.ts. Import @/features/${other}/contract or @/core/*.`,
    }));
}

function restrictImports(...patterns) {
  return { "no-restricted-imports": ["error", { patterns }] };
}

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts", "playwright-report/**", "test-results/**"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Client components ship to the browser, so they must never see the service-role client.
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            'Program:has(> ExpressionStatement[directive="use client"]) > ImportDeclaration[source.value=/db\\/admin$/]',
          message: "Client components must not import the admin database client.",
        },
      ],
    },
  },
  {
    files: [
      "src/app/**/*.{ts,tsx}",
      "src/core/ui/**/*.{ts,tsx}",
      "src/core/auth/components/**/*.{ts,tsx}",
      "src/core/analytics/**/*.{ts,tsx}",
    ],
    rules: restrictImports(adminImportRestriction),
  },
  ...features.flatMap((feature) => [
    {
      files: [`src/features/${feature}/**/*.{ts,tsx}`],
      rules: restrictImports(adminImportRestriction, ...crossFeatureRestrictions(feature)),
    },
    {
      // Later entry wins: server code may use the admin client but keeps the cross-feature ban.
      files: [`src/features/${feature}/server/**/*.{ts,tsx}`],
      rules: restrictImports(...crossFeatureRestrictions(feature)),
    },
  ]),
];

export default eslintConfig;
