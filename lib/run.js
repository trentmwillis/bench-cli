const path = require('path');
const walkSync = require('walk-sync');
const { stripExtension } = require('./lib/utilities');

module.exports = function run(input, iterations) {
  /**
   * A simple benchmark runner that finds all JS files exported in the `suites`
   * directory and executes predefined hooks in them.
   *
   *  setup: Runs once before all of the scenario iterations
   *  beforeScenario: Runs once before each of the scenario iterations
   *  scenario: The benchmark scenario for which time is recorded
   *  afterScenario: Runs once after each of the scenario iterations
   *  cleanup: Runs once after all of the scenario iterations
   *
   * Each hook is invoked with a `context` object that is empty by default. This
   * allows information to be shared between the hooks.
   */
  walkSync(input).reduce((chain, file) => {
    const hooks = require(path.join(suitesDir, file));
    const suite = new Suite({
      name: stripExtension(file),
      iterations,
      hooks
    });
    return chain.then(() => suite.run());
  }, Promise.resolve());
};
