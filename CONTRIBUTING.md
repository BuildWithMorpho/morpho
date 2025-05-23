# Local Development

Welcome ⚡️!! If you've found a bug, or have an idea to add a feature we'd love to hear from you. It may save time to first ping the group on [Morpho' Discord channel](https://discord.gg/yxjk5vn6pn) to talk through any ideas or any issues that may be a bug.

## Project Structure

Morpho is structured as a mono-repo using Yarn (v3) Workspaces and Nx. The packages
live under `packages/` and `examples/`:

- `core` (`@builder.io/morpho`): contains the Morpho engine
- `cli` (`@builder.io/morpho-cli`): contains the Morpho CLI, and _depends_ on `core`
- `site`: contains the Morpho site hosted at morpho.builder.io
- `eslint-plugin` (`@builder.io/eslint-plugin-morpho`): contains the Morpho eslint rules to enforce valid Morpho component syntax. Yet to be released.

## Installation

First, you should run `yarn` in the root of the project to install all the dependencies.

For all packages, the below steps to develop locally are the same:

```bash
# run local development server
yarn start

# run unit tests
yarn test
```

## Submitting Issues And Writing Tests

We need your help! If you found a bug, it's best to [create an issue](https://github.com/BuilderIO/morpho/issues/new/choose) and follow the template we've created for you. Afterwards, create a [Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) that replicates the issue using a test.

## Developing for Core & Testing

In `core`, we use vitest snapshots & integration tests for test coverage. If you are solving a problem that is reproducible by a fiddle in [morpho.builder.io/playground](/playground), we highly recommend the following flow:

### Snapshot test

- copy your fiddle component into a file in `packages/core/src/__tests__/data`. See [packages/core/src/**tests**/data/basic.raw.tsx](/packages/core/src/__tests__/data/basic.raw.tsx) as an example.
- add that test to the [test generator](/packages/core/src/__tests__/test-generator.ts), most likely in `BASIC_TESTS`.
- run `yarn g:nx test:watch` in the `packages/core` directory to run the snapshot tests in watch mode

PS: don't worry about failing imports in the raw test TSX files. These are not an issue, since the files are standalone and don't actually belong to a cohesive project.

### Integration test

- copy your fiddle component into a `.lite.tsx` Morpho component in the [e2e app](/e2e/e2e-app/src/components)
- name your file the same as your component to resolve it for Angular
- add your component to the [e2e-app component paths](/e2e/e2e-app/src/component-paths.ts)
- add your component to the [homepage](/e2e/e2e-app/src/homepage.lite.tsx) with a `<Show when={state.pathToUse.startsWith('/your-component-path')}>`
- add an integration test in [e2e/e2e-app/tests](/e2e/e2e-app/tests) that makes sure your component works as expected
- this integration test will run against every server that exists in [e2e/](/e2e/).
- run `yarn ci:build` to build all packages
- run `yarn ci:e2e` to run the integration tests against all servers

#### Create new e2e project for another target

If you want to create a new project inside `e2e`. You should name the folder `e2e-XXX` where `XXX` should be replaced with the target.
Make sure that you change the `name` inside `package.json` of this project to `@builder.io/e2e-XXX`. Additionally, you need to add `private: true` to `package.json` to avoid publishing the project.

### Test your changes

From there, you can keep iterating until the snapshots look as expected, and the integration tests pass!

### Preparing your PR

Before submitting your PR, please make sure to format the codebase and update all snapshots:

- format the codebase: from the root, run `yarn fmt:prettier`.
- update all snapshots (in core & CLI): from the root, run `yarn test:update`. This will run a Nx command that will update all the snapshots in the `core` and `cli` packages. while making sure all required dependencies are built beforehand. If there are some difference between the generated snapshots in your local environment and GitHub Action you are able to download the correct snapshots via 'Summary' in the pipeline run. Wait until the job `test-update` is done, scroll to the bottom and download `snapshots-updates`. You should be able to copy&past the snapshots to `packages/core/src/__tests__/__snapshots__`.
- add Changeset entry: from the root, run `yarn g:changeset` and follow the CLI instructions.

#### Changeset format

Here's the changeset format we like to follow (this is mostly relvant for the core package):

```
[GENERATORS_IMPACTED] TYPE: DESCRIPTION
```

Examples:

```
[React,Vue,Solid] Bug: Fix style bindings not applying.
[Angular] Feature: Add support for ngFor bindings.
[All] Feature: store state types.
```
