import { describe, it } from "node:test";
import safeVars, { z } from "./index.js";

import { equal } from "node:assert";

describe("SaveVars", () => {
  it("Should parsed correctly", () => {
    const schema = z.object({
      VARIABLE1: z.string(),
      VARIABLE2: z.string(),
    });

    const result = safeVars(schema);

    Object.entries(result).forEach(([key, value]) => {
      equal(process.env[key], value);
    });
  });
});
