# JSX-Lite CLI

A CLI for morpho.

## Installation

```bash
npm install -g @builder.io/morpho-cli
```

## Usage

```bash
morpho compile --to=<format> < <input-file>
cat my-file.tsx | morpho compile -t=<format>
morpho compile -t=<format> <input-file>
```

Check the output from `morpho compile --help`.

**Examples**

```bash
morpho compile -t react component.tsx
morpho compile -t react < component.tsx
cat component.tsx | morpho compile -t html -
morpho compile -t react --out-dir build -- src/**/*.tsx
```

## Options

Supported formats for `--to` are:

- `reactNative`
- `solid`
- `vue`
- `react`
- `template`
- `html`
- `customElement`
- `jsxLite`
- `builder`
- `swift`
- `svelte`
- `liquid`
- `angular`

Supported formats for `--from` are:

- `jsxLite`
- `builder`
- `liquid`

## Cook book

Here are some recipes for standard tasks

### Validate how Builder will transform Morpho

```bash
cat components/postscript.lite.tsx |
  morpho compile -t builder - |
  morpho compile -f builder -t jsxLite
```

### Run morpho on file system change

Use a tool like [entr](https://github.com/eradman/entr) or [guard](https://github.com/guard/guard)

```
find . -name '*lite.tsx' | entr make /_
```

## Known issues

- Running `morpho` from the root of this repository breaks due to some
  dynamic babel configuration look up
- Files that are created as the result of `--out-dir=<dir>` maintain the original
  file extension of the input file, which doesn't make any sense in the case of
  an html output.
- `--out=<file>` does not support concatenating multiple files together.

## Manual installation

```bash
git clone git@github.com:BuilderIO/morpho.git
cd morpho/packages/cli
npm install
npm run build
npm link
```

# License

MIT - see LICENSE
