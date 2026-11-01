import assert from "node:assert/strict";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import {
  parseThemePreference,
  themeBootstrapScript,
  themeStorageKey,
} from "./theme.ts";

await test("theme preferences accept only light and dark", () => {
  for (const value of ["light", "dark"] as const) {
    assert.equal(parseThemePreference(value), value);
  }
  for (const value of [undefined, null, "", "system", "Dark", "blue", {}, 1]) {
    assert.equal(parseThemePreference(value), "light");
  }
});

await test("pre-paint theme bootstrap validates saved values and handles blocked storage", () => {
  for (const [saved, blocked, expected] of [
    ["dark", false, "dark"],
    ["light", false, "light"],
    ["system", false, "light"],
    [null, false, "light"],
    ['dark";throw new Error("untrusted")', false, "light"],
    ["dark", true, "light"],
  ] as const) {
    const attributes = new Map<string, string>();
    const style: { colorScheme?: string } = {};
    runInNewContext(themeBootstrapScript, {
      localStorage: {
        getItem(key: string) {
          assert.equal(key, themeStorageKey);
          if (blocked) throw new Error("Storage unavailable");
          return saved;
        },
      },
      document: {
        documentElement: {
          setAttribute: (name: string, value: string) =>
            attributes.set(name, value),
          style,
        },
      },
    });
    assert.equal(attributes.get("data-ssd-theme"), expected);
    assert.equal(style.colorScheme, expected);
  }
});
