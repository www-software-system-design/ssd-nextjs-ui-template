import { readFileSync } from "node:fs";

const format =
  "<feat/fix>(SSD-000): <add/update/resolve/remove/cleanup> message";
const messageFile = process.argv[2];

if (!messageFile) {
  console.error("Usage: npm run check:commit -- <commit-message-file>");
  process.exit(1);
}

try {
  const subject = readFileSync(messageFile, "utf8").split(/\r?\n/, 1)[0] ?? "";
  if (
    !/^(feat|fix)\(SSD-\d{3}\): (add|update|resolve|remove|cleanup) \S[^\r\n]*$/.test(
      subject,
    )
  ) {
    console.error(
      `Invalid commit message. Expected: ${format}\nExample: feat(SSD-000): add commit message enforcement`,
    );
    process.exitCode = 1;
  }
} catch {
  console.error(`Cannot read commit message file: ${messageFile}`);
  process.exitCode = 1;
}
