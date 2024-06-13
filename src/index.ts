import z, { ZodRawShape } from "zod";

import { config } from "dotenv";

const rawEnvs = {};

config({ processEnv: rawEnvs });

/**
 * Wrapper for dotenv.config() that parses the result and sets the values in process.env
 *
 * E.g:
 *  import saveVars, { z } from "safe-vars";
 *
 *  const schema = z.object({
 *   VARIABLE1: z.string(),
 *   VARIABLE2: z.string()
 *  });
 *
 *  saveVars(schema);
 *
 *  console.log(process.env);
 *
 * @param schema
 * @returns
 */
export default function safeVars<T extends ZodRawShape>(
  schema: z.ZodObject<T>
) {
  const result = schema.safeParse(rawEnvs);

  if (result.success) {
    process.env = { ...process.env, ...result.data };
    return result.data;
  } else throw new Error(result.error.errors.map((e) => e.message).join("\n"));
}

export * as z from "zod";
