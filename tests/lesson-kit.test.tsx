import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { GAP, MC, ORDER } from "../runtime/kit";

test("minimal kit renders MC, GAP and ORDER controls", () => {
  assert.match(renderToStaticMarkup(<MC question="Choose" options={[{ id: "a", label: "Alpha" }]} value={null} onChange={() => {}} />), /Alpha/);
  assert.match(renderToStaticMarkup(<GAP prompt="The ___ is here" choices={["truck"]} value={null} onChange={() => {}} />), /truck/);
  assert.match(renderToStaticMarkup(<ORDER tokens={["is", "it"]} value={[]} onChange={() => {}} />), /is/);
});
