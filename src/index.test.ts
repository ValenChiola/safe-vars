import { describe, it } from "node:test";
import { doesNotThrow, equal, throws } from "node:assert";
import safeVars, { SafeVarsOptions, z } from "./index.js";

const options = {
  dotenv: {
    path: ".env.test",
  },
} satisfies SafeVarsOptions;

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

  it("Should called the callbacks", () => {
    const schema = z.object({
      VARIABLE1: z.string(),
      VARIABLE2: z.string(),
    });

    let onSuccessCalled = false;
    let onErrorCalled = false;

    const onSuccess = () => (onSuccessCalled = true);
    const onError = () => (onErrorCalled = true);

    safeVars(schema, { ...options, onSuccess, onError });

    equal(onSuccessCalled, true, "onSuccess should be called");
    equal(onErrorCalled, false, "onError should not be called");

    onSuccessCalled = false;
    onErrorCalled = false;

    const errorSchema = z.object({
      VARIABLE1: z.string(),
      VARIABLE2: z.string(),
      VARIABLE3: z.string(),
    });

    try {
      safeVars(errorSchema, { ...options, onSuccess, onError });
    } catch (e) {
      // Expected error
    }

    equal(onSuccessCalled, false, "onSuccess should not be called on error");
    equal(onErrorCalled, true, "onError should be called");
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
