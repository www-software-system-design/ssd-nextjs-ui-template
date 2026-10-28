import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

const checker = join(import.meta.dirname, "check-commit-message.ts");

await test("commit message checker accepts the required subjects and optional bodies", () => {
  const root = mkdtempSync(join(tmpdir(), "mfe-commit-"));
  const file = join(root, "commit message.txt");
  try {
    for (const type of ["feat", "fix"]) {
      for (const action of ["add", "update", "resolve", "remove", "cleanup"]) {
        const message = `${type}(SSD-123): ${action} template tooling`;
        writeFileSync(file, `${message}\r\n\r\nOptional explanation.\r\n`);
        const result = spawnSync(process.execPath, [checker, file]);
        assert.equal(result.status, 0, result.stderr.toString());
      }
    }
    writeFileSync(file, "feat(SSD-000): add initial template\n");
    assert.equal(spawnSync(process.execPath, [checker, file]).status, 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

await test("commit message checker rejects malformed subjects and missing input", () => {
  const root = mkdtempSync(join(tmpdir(), "mfe-commit-"));
  const file = join(root, "message.txt");
  try {
    for (const message of [
      "",
      "chore(SSD-000): add tooling",
      "Feat(SSD-000): add tooling",
      "feat(ABC-000): add tooling",
      "feat(SSD-00): add tooling",
      "feat(SSD-0000): add tooling",
      "feat(SSD-abc): add tooling",
      "feat(SSD-000): create tooling",
      "feat(SSD-000): add",
      "feat(SSD-000): add   ",
      "feat(SSD-000):add tooling",
      " feat(SSD-000): add tooling",
      "\nfeat(SSD-000): add tooling",
      "Merge branch 'main'",
      "fixup! feat(SSD-000): add tooling",
    ]) {
      writeFileSync(file, message);
      const result = spawnSync(process.execPath, [checker, file]);
      assert.equal(result.status, 1, `Must reject: ${message}`);
      assert.match(result.stderr.toString(), /Invalid commit message/);
    }
    const missingFile = spawnSync(process.execPath, [
      checker,
      join(root, "absent"),
    ]);
    assert.equal(missingFile.status, 1);
    assert.match(
      missingFile.stderr.toString(),
      /Cannot read commit message file/,
    );
    const missingArgument = spawnSync(process.execPath, [checker]);
    assert.equal(missingArgument.status, 1);
    assert.match(missingArgument.stderr.toString(), /Usage:/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
