import { getDictionarySize,checkerEngine } from "./common.mjs";
import assert from "node:assert";
import test from "node:test";

test("Dictionary size is correct", () => {
  assert.equal(getDictionarySize(), 856);
});


//checker engine test
test("Should identify misspelled words", () => {
  const tokenizedWords = ["make", "wrld", "this", "a", "tst"];
  const expectedMisspelled = ["wrld", "tst"];
  assert.deepEqual(checkerEngine(tokenizedWords), expectedMisspelled);
});

