module.exports = class Suite {
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
   * Runs the given suite and records the time for
   */
  run() {
    let promise = this.invoke('setup');

    for (let i = 0; i < this.iterations; i++) {
      promise = promise
        .then(() => this.invoke('beforeScenario'))
        .then(() => {
          let startTime = Date.now();
          let scenarioPromise = this.invoke('scenario');
          return scenarioPromise.then(() => {
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
      });
  }
}
