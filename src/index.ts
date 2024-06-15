import { DotenvConfigOptions, config } from "dotenv";
import z, { ZodRawShape, ZodUndefined } from "zod";

/**
 * Wrapper for dotenv.config() that parses the result and sets the values in process.env
 *
 * E.g:
 * ```typescript 
 * import safeVars, { z } from "@valentino.chiola/safe-vars";
 *
 *  const schema = z.object({
 *   VARIABLE1: z.string(),
 *   VARIABLE2: z.string()
 *  });
 *
 *  safeVars(schema);
 *
 *  console.log(process.env);
 *```
 
 * @param schema: the `zod` schema to validate the variables
 * @param options: the options for the `safeVars` function @see SafeVarsOptions
 * @returns the parsed variables
 */
export default function safeVars<
  T extends ZodRawShape,
  Options extends SafeVarsOptions
>(
  schema: z.ZodObject<T>,
  // @ts-ignore
  { inject = true, log = false, throw: safe = true, dotenv }: Options = {}
): {
  [K in keyof T]: Options["throw"] extends false
    ? T[K]["_type"] | undefined
    : T[K]["_type"];
} {
  const rawEnvs = {};

  config({ processEnv: rawEnvs, ...dotenv });

  if (log)
    console.log(
      "Environment variables: \n",
      Object.entries(rawEnvs)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")
    );

  const result = schema.safeParse(rawEnvs);

  if (!result.success && safe !== false)
    throw new Error(
      result.error.errors
        .map(({ message, path }) => `${message}: ${path.join(" ")}`)
        .join("\n")
    );

  if (inject) process.env = { ...process.env, ...result.data };

  // @ts-ignore
  return result.data;
}

/**
 * Options for the `safeVars` function:
 *
 * @param inject: If true, the variables will be injected in the `process.env` object. `Default: true`
 * @param log: If true, the variables will be logged in the console. `Default: false`. `Warning`: This option should be used for debugging purposes only.
 * @param throw: If false, it won't throw an error if the variables are not defined in the `.env` file, `but all the variables would be optional`. `Advice`: `export const env = safeVars(schema, { safe: true });`. `Default: true`.
 * @param dotenv: Options for the `dotenv` package. @see DotenvConfigOptions
 */
export interface SafeVarsOptions {
  /**
   * If true, the variables will be injected in the `process.env` object.
   *
   * `Default: true`
   */
  inject?: boolean;

  /**
   * If true, the variables will be logged in the console.
   *
   * `Warning`: This option should be used for debugging purposes only.
   *
   * `Default: false`.
   */
  log?: boolean;

  /**
   * If false, it won't throw an error if the variables are not defined in the `.env` file, `but all the variables would be optional`.
   *
   * `Advice`:
   * ```typescript
   * export const env = safeVars(schema, { throw: true });
   * ```
   *
   * `Default: true`
   */
  throw?: boolean;

  /**
   * Options for the `dotenv` package. @see DotenvConfigOptions
   */
  dotenv?: Omit<DotenvConfigOptions, "processEnv">;
}

export * as z from "zod";
