import assert from "node:assert/strict";
import { test } from "node:test";
import { createUiStore, type UiPreferences } from "./ui-store.ts";

await test("separate app trees cannot change each other's UI preferences", () => {
  const first = createUiStore();
  const second = createUiStore();
  first.getState().setDensity("compact");
  assert.equal(first.getState().density, "compact");
  assert.equal(second.getState().density, "comfortable");
  assert.equal(first.getInitialState().density, "comfortable");
});

await test("server and client initialization produce matching public snapshots", () => {
  const initialState: UiPreferences = { density: "compact", theme: "dark" };
  const server = createUiStore(initialState);
  const client = createUiStore(structuredClone(initialState));
  assert.equal(
    server.getInitialState().density,
    client.getInitialState().density,
  );
  client.getState().setDensity("comfortable");
  assert.equal(initialState.density, "compact");
  assert.equal(server.getState().density, "compact");
  assert.equal(client.getInitialState().density, "compact");
  assert.equal(server.getInitialState().theme, client.getInitialState().theme);
  client.getState().setTheme("light");
  assert.equal(initialState.theme, "dark");
  assert.equal(server.getState().theme, "dark");
  assert.equal(client.getState().density, "comfortable");
});

await test("subscribers receive preference changes and can unsubscribe", () => {
  const store = createUiStore();
  const observed: string[] = [];
  const unsubscribe = store.subscribe((state) => observed.push(state.density));
  const setDensity = store.getState().setDensity;
  setDensity("compact");
  setDensity("comfortable");
  unsubscribe();
  setDensity("compact");
  assert.deepEqual(observed, ["compact", "comfortable"]);
  assert.equal(store.getState().setDensity, setDensity);
});
