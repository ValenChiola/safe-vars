import { describe, it } from "node:test";
import { doesNotThrow, equal, throws } from "node:assert";
import safeVars, { SafeVarsOptions, z } from "./index.js";

const options: SafeVarsOptions = {
  dotenv: {
    path: ".env.test",
  },
};

describe("SafeVars", () => {
  it("Should parsed correctly", () => {
    const schema = z.object({
      VARIABLE1: z.string(),
      VARIABLE2: z.string(),
    });

    const result = safeVars(schema, options);

    Object.entries(result).forEach(([key, value]) =>
      equal(process.env[key], value)
    );
  });

  it("Should throw an error", () => {
    const schema = z.object({
      VARIABLE1: z.string(),
      VARIABLE2: z.string(),
      VARIABLE3: z.string(),
    });

    throws(() => safeVars(schema, options));
    throws(() => safeVars(schema, { ...options, throw: true }));
  });

  it("Should not throw an error", () => {
    const schema = z.object({
      VARIABLE1: z.string(),
      VARIABLE2: z.string(),
      VARIABLE3: z.string(),
    });

    doesNotThrow(() => safeVars(schema, { ...options, throw: false }));
  });

  it("Should be well typed", () => {
    const schema = z.object({
      VARIABLE1: z.string(),
      VARIABLE2: z.string(),
    });

    const result = safeVars(schema, options);

    // @ts-expect-error
    result.VARIABLE1 = 1;
    // @ts-expect-error
    result.VARIABLE2 = 1;

    const result2 = safeVars(schema, { ...options, throw: false });

    result2.VARIABLE1 = undefined;
    result2.VARIABLE2 = undefined;
  });
});
