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