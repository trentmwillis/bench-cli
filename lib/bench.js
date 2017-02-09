const { average } = require('./utilities');

module.exports = class Bench {
  constructor(options = {}) {
    if (!options.name) {
      throw new Error('You must provide a name for your Bench.');
    } else if (!options.iterations || options.iterations < 1) {
      throw new Error('You must specify a number of iterations greater than 0.');
    } else if (!options.hooks || typeof options.hooks.scenario !== 'function') {
      throw new Error('You must specify a hooks object with at least a scenario function.');
    }

    this.name = options.name;
    this.iterations = options.iterations;
    this.hooks = options.hooks;

    this._context = {};
    this._times = [];
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
       result = this.hooks[hookName].call(this._context);
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
            this._times.push(elapsedTime);
          });
        })
        .then(() => this.invoke('afterScenario'));
    }

    return promise
      .then(() => this.invoke('cleanup'))
      .then(() => {
        console.log(`Average time for ${this.name} over ${this.iterations} iterations: ${average(this._times)}ms`);
      })
      .catch((error) => {
        console.error(error.stack);
      });
  }
};
