# Depcruise PR Check - GitHub Actions

## What is it ?

GitHub action to comment [depcruise](https://github.com/sverweij/dependency-cruiser) report to a pull request, also provides an optional status check for the job.

## Usage

### Classic usage

```yml
on: pull_request

jobs:
  example_depcruise_pr:
    runs-on: ubuntu-latest
    name: An example job to comment depcruise report to a PR
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Depcruise
        uses: josteph/depcruise-pull-request@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Specifying which pull request to comment on

You can explicitly input which pull request should be commented on by passing the `pr_number` input.
That is particularly useful for manual workflow for instance (`workflow_run`).

```yml
...
- name: Depcruise
  uses: josteph/depcruise-pull-request@v1
  with:
    pr_number: 100 # This will comment on pull request #100
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Specifying baseDir and depcruise config file

You can also override the `baseDir` and depcruise config file path. The path must be relative to root directory.

```yml
...
- name: Depcruise
  uses: josteph/depcruise-pull-request@v1
  with:
    depcruise_base_dir: 'packages/monorepo-a'
    depcruise_config: 'packages/monorepo-a/.dependency-cruiser.js'
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs 

### Action inputs

| Name | Description | Required | Default |
| --- | --- | --- | --- |
| `GITHUB_TOKEN` | Token that is used to create comments | ✅ | |
| `depcruise_base_dir` | The baseDir for depcruise to start the scanning | | `'src'` |
| `depcruise_config` | Path to the config file for depcruise. | | `./.dependency-cruiser.js` |
| `pr_number` | The number of the pull request where to create the comment | | current PR number (deduced from context) |
| `comment_includes` | The text that should be used to find comment in case of replacement. | | `'Forbidden dependency check'` |
| `status_check` | If there is any rules violation detected, it will exit the job with status code. | | `true` |

## Build

The build steps bundles the `src/main.ts` to `lib/index.js` which is used in a NodeJS environment.
It is handled by [`esbuild`](https://esbuild.github.io/) compiler.

```sh
$ npm run build
```

