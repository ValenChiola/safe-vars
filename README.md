<br style="padding: 50px 0;"/>
<br style="padding: 50px 0;"/>
<h1 align="center">
  Safe Vars
</h1>
<p align="center">
    <a href="https://www.npmjs.com/package/@valentino.chiola/safe-vars">
        <img src="https://img.shields.io/npm/d18m/%40galiprandi%2Freact-tools?style=for-the-badge&logo=npm&color=CB3837" alt="NPM Downloads"/>
    </a>
    <a href="https://github.com/ValenChiola/safe-vars">
        <img src="https://img.shields.io/github/stars/galiprandi/react-tools?style=for-the-badge&logo=github&color=181717" alt="JSR Version"/>
    </a>
</p>

#### Welcome to `@valentino.chiola/safe-vars`, a wrapper for `dotenv.config()` that parses the result and sets the values in `process.env`

### Installation

To install use one of the following commands:

```bash
npm i @valentino.chiola/safe-vars
```

```bash
pnpm i @valentino.chiola/safe-vars
```

```bash
yarn add @valentino.chiola/safe-vars
```

## Basic usage

```ts
import safeVars, { z } from "@valentino.chiola/safe-vars";

const schema = z.object({
  VARIABLE1: z.string(),
  VARIABLE2: z.string(),
  BOOLEAN: z.coerce.boolean()
});

safeVars(schema)

console.log(process.env)
```

If in your `.env` file you have declared `VARIABLE1` and `VARIABLE2`, it won't throw an error.

> Note: any extra variables in your `.env`, that are not present in the `schema`, will be removed.
> Note: if the `BOOLEAN` variable is not defined, `zod` will cast it to `false`.

## Options

- `inject`: If true, the variables will be injected in the `process.env` object. `Default: true`

```ts
import safeVars, { z } from "@valentino.chiola/safe-vars";

const schema = z.object({
  VARIABLE1: z.string(),
});

export const env = safeVars(schema, { inject: false })

console.log(env.VARIABLE1) // VARIABLE 1
console.log(process.env.VARIABLE1) // undefined
```

- `log`: If true, the variables will be logged in the console. `Default: false`.
  Also can be an object with an `only` property which is an array of the variables that you want to log.
  `Warning`: This option should be used for debugging purposes only.

```ts
import safeVars, { z } from "@valentino.chiola/safe-vars";

const schema = z.object({
  VARIABLE1: z.string(),
});

safeVars(schema, { log: true })
```

or:

```ts
import safeVars, { z } from "@valentino.chiola/safe-vars";

const schema = z.object({
  VARIABLE1: z.string(),
  VARIABLE2: z.string(),
  SUPER_SECRET: z.string()
});

safeVars(schema, {
  log: {
    only: ["VARIABLE1", "VARIABLE2"],
  },
});
```

- `throw`: If false, it won't throw an error if the variables are not defined in the `.env` file, `but all the variables would be optional`. `Default: true`

```ts
import safeVars, { z } from "@valentino.chiola/safe-vars";

const schema = z.object({
  VARIABLE1: z.string(),
});

safeVars(schema, { throw: false });
```

The type of `env.VARIABLE1` will be `string | undefined`

- `onSuccess`: Callback function to be executed if all environment variables are successfully validated.

```ts
import safeVars, { z } from "@valentino.chiola/safe-vars";

const schema = z.object({
  VARIABLE1: z.string(),
});

safeVars(schema, {
  onSuccess: (env) => console.log("🚀 Envs loaded!"),
});
```

- `onError`: Callback function to be executed if there are errors in the validation.

```ts
import safeVars, { z } from "@valentino.chiola/safe-vars";

const schema = z.object({
  VARIABLE1: z.string(),
});

safeVars(schema, {
  onError: (errors) => console.error("❌ Error loading envs", errors),
});
```

- `dotenv`: An object that represents the options for the `dotenv` package.
  - `path`: You can use the `path` key to determine witch `.env` file should be parsed. This is useful for testing.

  ```ts
  import safeVars, { z } from "@valentino.chiola/safe-vars";

  const schema = z.object({
    VARIABLE1: z.string(),
  });

  safeVars(schema, {
    dotenv: {
      path: ".env.test",
    }
  });
  ```

## Typed Envs

The are two ways to have your envs typed.

- `declare module`:
  
```ts
import safeVars, { z } from "@valentino.chiola/safe-vars";

const schema = z.object({
  VARIABLE1: z.string(),
});

safeVars(schema);

declare global {
  module NodeJS {
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
}  
```

- `return value`:

Instead of using `process.env` you can use the `safeVars`'s return value.
  
```ts
const schema = z.object({
  VARIABLE1: z.string(),
});

export const env = safeVars(schema, { inject: false });
```

The type of `env.VARIABLE1` will be `string`

## Contribution

Contributions are welcome! To contribute:

1. Fork this repository.
2. Create a branch with a meaningful description.
3. Make the desired changes.
4. Update the **documentation** if necessary.
5. Open a Pull Request to the main branch.

If you find an issue or have a suggestion to improve the project, feel free to [open an issue](https://github.com/ValenChiola/safe-vars/issues).

## License

This project is licensed under the MIT License.
