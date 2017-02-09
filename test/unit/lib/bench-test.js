const assert = require('assert');
const sinon = require('sinon');
const Bench = require('../../../lib/bench');

describe('lib/bench', function() {
  describe('constructor', function() {
    it('throws an error when no name is given', function() {
      assert.throws(() => {
        new Bench();
      }, /You must provide a name for your Bench/);
    });

    it('throws an error when iterations are less than 1', function() {
      assert.throws(() => {
        new Bench({
          name: 'test'
        });
      }, /You must specify a number of iterations greater than 0/);
    });

    it('throws an error when not providing a scenario to benchmark', function() {
      assert.throws(() => {
        new Bench({
          name: 'test',
          iterations: 1
        });
      }, /You must specify a hooks object with at least a scenario function/);
    });
  });

  describe('invoke', function() {
    it('always returns a Promise', function() {
      let bench = new Bench({
        name: 'test',
        iterations: 1,
        hooks: {
          scenario() {},

          returnsNonPromise() {
            return 'not a promise';
          },

          returnsPromise() {
            return Promise.resolve('a promise');
          }
        }
      });

      let nonPromiseHook = bench.invoke('returnsNonPromise');
      let promiseHook = bench.invoke('returnsPromise');

      assert.ok(nonPromiseHook instanceof Promise);
      assert.ok(promiseHook instanceof Promise);

      return Promise.all([
        nonPromiseHook,
        promiseHook
      ]).then((result) => {
        assert.ok(result[0], 'not a promise');
        assert.ok(result[1], 'a promise');
      });
    });

    it('resolves with undefined when hook is not defined', function() {
      let bench = new Bench({
        name: 'test',
        iterations: 1,
        hooks: {
          scenario() {}
        }
      });

      return bench.invoke('doesNotExist').then((result) => {
        assert.strictEqual(result, undefined);
      });
    });
  });

  describe('run', function() {
    it('runs all hooks in correct order and number of times', function() {
      let hooks = {
        setup: sinon.stub(),
        beforeScenario: sinon.stub(),
        scenario: sinon.stub(),
        afterScenario: sinon.stub(),
        cleanup: sinon.stub()
      };
      let bench = new Bench({
        name: 'test',
        iterations: 2,
        hooks
      });

      sinon.stub(console, 'log');

      return bench.run().then(() => {
        sinon.assert.calledOnce(hooks.setup);
        sinon.assert.calledThrice(hooks.beforeScenario);
        sinon.assert.calledThrice(hooks.scenario);
        sinon.assert.calledThrice(hooks.afterScenario);
        sinon.assert.calledOnce(hooks.cleanup);

        sinon.assert.calledOnce(console.log);
        console.log.restore();
      });
    });

    it('logs errors', function() {
      let bench = new Bench({
        name: 'test',
        iterations: 2,
        hooks: {
          scenario() {
            throw new Error('Oh noes!');
          }
        }
      });

      sinon.stub(console, 'error');

      return bench.run().then(() => {
        sinon.assert.calledOnce(console.error);
        console.error.restore();
      });
    });
  });
});
