const path = require('path');
const walkSync = require('walk-sync');
const Bench = require('./bench');
const { stripExtension } = require('./utilities');

module.exports = function run(input, iterations) {
  walkSync(input).reduce((chain, file) => {
    const hooks = require(path.join(input, file));
    const bench = new Bench({
      name: stripExtension(file),
      iterations,
      hooks
    });
    return chain.then(() => bench.run());
  }, Promise.resolve());
};
