const { average } = require('./utilities');

module.exports = class Bench {
  constructor(options) {
    this.name = options.name;
    this.iterations = options.iterations;

    this.context = {};
    this.times = [];

    this.hooks = options.hooks;
  }

  /**
   * Invokes a given hook and ensures the return value is a Promise.
   *
   * @method invoke
   * @param {String} hookName
   * @return {Promise}
   */
  invoke(hookName) {
    let result;

    if (this.hooks[hookName]) {
       result = this.hooks[hookName].call(this.context);
    }

    return Promise.resolve(result);
  }

  /**
   * Runs the given benchmark and records the time for
   */
  run() {
    let promise = this.invoke('setup');

    // We do one extra iteration to avoid cache/priming issues
    for (let i = 0; i < this.iterations + 1; i++) {
      promise = promise
        .then(() => this.invoke('beforeScenario'))
        .then(() => {
          let startTime = Date.now();
          let scenarioPromise = this.invoke('scenario');
          return scenarioPromise.then(() => {
            if (i === 0) { return; }

            let elapsedTime = Date.now() - startTime;
            this.times.push(elapsedTime);
          });
        })
        .then(() => this.invoke('afterScenario'));
    }

    return promise
      .then(() => this.invoke('cleanup'))
      .then(() => {
        console.log(`Average time for ${this.name} over ${this.iterations} iterations: ${average(this.times)}ms`);
      })
      .catch((error) => {
        console.error(error.stack);
      });
  }
};
