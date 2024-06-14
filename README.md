<br style="padding: 50px 0;"/>
<br style="padding: 50px 0;"/>

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
  NEEDS_TO_BE_BOOLEAN: z.coerce.boolean()
});

safeVars(schema)

console.log(process.env)
```

If in your `.env` file you have declared `VARIABLE1` and `VARIABLE2`, it won't throw an error.

> Note: any extra variables in your `.env`, that it is not present in the `schema`, will be removed.

## Typed Envs

The are two ways to have your envs typed.

- `declare module`:
  
```ts
const schema = z.object({
  VARIABLE1: z.string(),
  VARIABLE2: z.string(),
});

safeVars(schema);

declare global {
  module NodeJS {
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
}  
```

- `return value`:

Instead of using `process.env` you can use the return value of the function `safeVars`.
  
```ts
const schema = z.object({
  VARIABLE1: z.string(),
  VARIABLE2: z.string(),
});

export const env = safeVars(schema);
```

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
