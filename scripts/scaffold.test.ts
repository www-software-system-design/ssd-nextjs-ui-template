import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  existsSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkArchitecture } from "./check-architecture.ts";

await test("feature scaffold includes guidance and refuses overwrites and traversal", () => {
  const root = mkdtempSync(join(tmpdir(), "mfe-scaffold-"));
  const generator = join(import.meta.dirname, "generate-feature.ts");
  try {
    execFileSync(process.execPath, [generator, "billing"], { cwd: root });
    const guidePath = join(root, "src/features/billing/AGENTS.md");
    assert.equal(
      existsSync(join(root, "src/features/billing/actions.ts")),
      false,
    );
    assert.match(readFileSync(guidePath, "utf8"), /billing product capability/);
    assert.match(
      readFileSync(
        join(root, "src/features/billing/components/AGENTS.md"),
        "utf8",
      ),
      /shared-library/,
    );
    writeFileSync(guidePath, "consumer-owned");
    for (const name of [
      "billing",
      "../outside",
      "UpperCase",
      "nested/name",
      "",
    ]) {
      const result = spawnSync(process.execPath, [generator, name], {
        cwd: root,
      });
      assert.equal(result.status, 1, `Must reject ${name}`);
    }
    assert.equal(readFileSync(guidePath, "utf8"), "consumer-owned");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

await test("Server Action scaffold is opt-in and rejects invalid options without writing", () => {
  const root = mkdtempSync(join(tmpdir(), "mfe-actions-scaffold-"));
  const generator = join(import.meta.dirname, "generate-feature.ts");
  try {
    for (const options of [
      ["--unknown"],
      ["--server-actions", "--server-actions"],
      ["--server-actions", "../outside"],
    ]) {
      const result = spawnSync(
        process.execPath,
        [generator, "invoices", ...options],
        {
          cwd: root,
        },
      );
      assert.equal(result.status, 1);
      assert.equal(existsSync(join(root, "src/features/invoices")), false);
    }

    execFileSync(
      process.execPath,
      [generator, "invoices", "--server-actions"],
      {
        cwd: root,
      },
    );
    const actionPath = join(root, "src/features/invoices/actions.ts");
    assert.match(readFileSync(actionPath, "utf8"), /^"use server";/);
    assert.match(
      readFileSync(join(root, "src/features/invoices/AGENTS.md"), "utf8"),
      /<verb><Entity>Action/,
    );
    writeFileSync(actionPath, "consumer-owned");
    const repeated = spawnSync(
      process.execPath,
      [generator, "invoices", "--server-actions"],
      { cwd: root },
    );
    assert.equal(repeated.status, 1);
    assert.equal(readFileSync(actionPath, "utf8"), "consumer-owned");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

await test("architecture catches alias, relative, export, and dynamic cross-boundary imports", () => {
  const root = mkdtempSync(join(tmpdir(), "mfe-architecture-"));
  const write = (path: string, content: string) => {
    const full = join(root, path);
    mkdirSync(join(full, ".."), { recursive: true });
    writeFileSync(full, content);
  };
  try {
    write(
      "package.json",
      JSON.stringify({
        dependencies: { "@software-system.design/ui": "0.3.0" },
      }),
    );
    write(
      "src/features/billing/model.ts",
      'import { value } from "../accounts/model"; export { page } from "@/app/page";',
    );
    write(
      "src/lib/invalid.ts",
      'const feature = import("@/features/billing/model");',
    );
    write("src/config/valid.ts", 'export const name = "test";');
    const errors = checkArchitecture(root);
    assert.equal(
      errors.filter((error) => error.includes("forbidden dependency")).length,
      3,
    );
    assert.ok(
      errors.some((error) => error.includes("Missing feature guidance")),
    );
    assert.ok(errors.some((error) => error.includes("Missing ADR index")));
    write(
      "src/features/billing/model.ts",
      'import { Button } from "@software-system.design/ui/button";',
    );
    write("src/lib/invalid.ts", 'export { name } from "@/config/valid";');
    assert.equal(
      checkArchitecture(root).filter((error) =>
        error.includes("forbidden dependency"),
      ).length,
      0,
    );
    write(
      "package.json",
      JSON.stringify({
        dependencies: { "@software-system.design/ui": "file:../ui" },
      }),
    );
    assert.ok(
      checkArchitecture(root).some((error) =>
        error.includes("Pin a published"),
      ),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
