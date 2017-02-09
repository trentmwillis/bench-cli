# Bench-CLI

Bench-CLI is an easy-to-use CLI for running benchmarks.

## Running Benchmarks

Running benchmarks is designed to be super simple and easy. You simply specify a `path` to the directory where your benchmark scenarios are located and then the number of iterations to run for each scenario.

```bash
bench <directory> --iterations <number>
```

If you don't specify a `directory`, the command will default to `bench`, relative to your current working directory.

## Defining Benchmarks

Benchmarks are defined by creating a simple object export, known as a `Bench`. Each `Bench` defines a `scenario` function which represents the code to be benchmarked. They can optionally define several hooks which allow for setup and cleanup before and after runs.

```js
module.exports = {
  // [Optional] Runs once before all of the scenario iterations
  setup() {},

  // [Optional] Runs once before each of the scenario iterations
  beforeScenario() {},

  // The benchmark scenario for which time is recorded
  scenario() {},

  // [Optional] Runs once after each of the scenario iterations
  afterScenario() {},

  // [Optional] Runs once after all of the scenario iterations
  cleanup() {}
};
```

Each of the above hooks, including `scenario`, is invoked with a `context` object that is empty by default. This allows information to be shared between the hooks, without having to rely on module state.

You can only define one `scenario` per `Bench` and, thus, per file. This limitation is in place to encourage isolation of benchmarking scenarios to help guarantee that you are getting accurate results.
