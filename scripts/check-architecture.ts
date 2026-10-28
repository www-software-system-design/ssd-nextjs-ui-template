import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const requiredGuides = [
  "AGENTS.md",
  "src/AGENTS.md",
  "src/app/AGENTS.md",
  "src/features/AGENTS.md",
  "src/components/AGENTS.md",
  "src/lib/AGENTS.md",
  "src/config/AGENTS.md",
  "src/contents/AGENTS.md",
  "scripts/AGENTS.md",
  "docs/adr/AGENTS.md",
];

function sourceFiles(directory: string): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory()
      ? sourceFiles(path)
      : /\.[cm]?tsx?$/.test(entry.name)
        ? [path]
        : [];
  });
}

function imports(file: string): string[] {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  const values: string[] = [];
  function visit(node: ts.Node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      values.push(node.moduleSpecifier.text);
    }
    if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) &&
          node.expression.text === "require"))
    ) {
      const argument = node.arguments[0];
      if (argument && ts.isStringLiteralLike(argument))
        values.push(argument.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return values;
}

export function checkArchitecture(root: string): string[] {
  const errors: string[] = [];
  for (const guide of requiredGuides) {
    if (!existsSync(join(root, guide)))
      errors.push(`Missing guidance: ${guide}`);
  }
  if (!existsSync(join(root, "docs/adr/README.md")))
    errors.push("Missing ADR index");
  if (existsSync(join(root, "src/components/ui")))
    errors.push("Use the shared UI package; src/components/ui is forbidden");
  const features = join(root, "src/features");
  if (existsSync(features)) {
    for (const entry of readdirSync(features, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      for (const layer of ["", "components"]) {
        const directory = join(features, entry.name, layer);
        if (
          existsSync(directory) &&
          !existsSync(join(directory, "AGENTS.md"))
        ) {
          errors.push(
            `Missing feature guidance: ${relative(root, directory)}/AGENTS.md`,
          );
        }
      }
    }
  }
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
    dependencies?: Record<string, string>;
  };
  const uiVersion = pkg.dependencies?.["@software-system.design/ui"];
  if (!uiVersion || !/^\d+\.\d+\.\d+$/.test(uiVersion)) {
    errors.push(
      "Pin a published @software-system.design/ui version in dependencies",
    );
  }
  const sourceRoot = join(root, "src");
  for (const file of sourceFiles(sourceRoot)) {
    const from = relative(sourceRoot, file).replaceAll("\\", "/").split("/");
    for (const specifier of imports(file)) {
      if (
        specifier.startsWith("@software-system.design/ui/") &&
        /\/(src|dist)(\/|$)/.test(specifier)
      )
        errors.push(`${file}: use public UI exports`);
      const target = specifier.startsWith("@/")
        ? resolve(sourceRoot, specifier.slice(2))
        : specifier.startsWith(".")
          ? resolve(dirname(file), specifier)
          : undefined;
      if (!target) continue;
      const to = relative(sourceRoot, target).replaceAll("\\", "/").split("/");
      const forbidden =
        (from[0] !== "app" && to[0] === "app") ||
        (from[0] !== "app" && from[0] !== "features" && to[0] === "features") ||
        (from[0] === "features" && to[0] === "features" && from[1] !== to[1]);
      if (forbidden)
        errors.push(
          `${relative(root, file)}: forbidden dependency ${specifier}`,
        );
    }
  }
  return errors;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const errors = checkArchitecture(process.cwd());
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else {
    console.log("Architecture and scoped guidance checks passed.");
  }
}
