const assert = require('assert');
const program = require('commander');

let iterationCount = 0;

module.exports = {
  setup() {
    this.lastHook = 'setup';
  },

  beforeScenario() {
    if (iterationCount === 0) {
      assert.strictEqual(this.lastHook, 'setup');
    } else {
      assert.strictEqual(this.lastHook, `afterScenario${iterationCount}`);
    }

    this.lastHook = `beforeScenario${++iterationCount}`;
  },

  scenario() {
    assert.strictEqual(this.lastHook, `beforeScenario${iterationCount}`);
    this.lastHook = `scenario${iterationCount}`;
  },

  afterScenario() {
    assert.strictEqual(this.lastHook, `scenario${iterationCount}`);
    this.lastHook = `afterScenario${iterationCount}`;
  },

  cleanup() {
    assert.strictEqual(this.lastHook, `afterScenario${iterationCount}`);

    let expectedIterationCount = (program.iterations || 1) + 1;
    assert.strictEqual(iterationCount, expectedIterationCount);
  }
};
