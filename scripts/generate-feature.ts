import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [name, ...extra] = process.argv.slice(2);
if (!name || extra.length || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name)) {
  console.error("Usage: npm run generate:feature -- <kebab-case-name>");
  process.exit(1);
}

const parent = join(process.cwd(), "src", "features");
const target = join(parent, name);
mkdirSync(parent, { recursive: true });
try {
  // Non-recursive creation intentionally refuses an existing feature.
  mkdirSync(target);
} catch (error) {
  console.error(
    `Cannot create feature "${name}": ${error instanceof Error ? error.message : "unknown error"}`,
  );
  process.exit(1);
}
mkdirSync(join(target, "components"));
for (const relative of ["AGENTS.md", "components/AGENTS.md"]) {
  const template = readFileSync(
    join(import.meta.dirname, "templates", "feature", relative),
    "utf8",
  );
  writeFileSync(
    join(target, relative),
    template.replaceAll("{{FEATURE_NAME}}", name),
    { flag: "wx" },
  );
}
console.log(
  `Created src/features/${name}. Add the capability, its tests, and update its local AGENTS.md.`,
);
