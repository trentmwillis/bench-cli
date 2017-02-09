const assert = require('assert');
const { average, stripExtension } = require('../../../lib/utilities');

describe('lib/utilities', function() {
  describe('average', function() {
    it('calculates the average of the passed in numbers', function() {
      let result = average([2, 4, 6, 8, 10]);
      assert.strictEqual(result, 6);
    });
  });

  describe('stripExtension', function() {
    it('removes the file extension from a given path', function() {
      let result = stripExtension('some/file/path.js');
      assert.strictEqual(result, 'some/file/path');

      result = stripExtension('some/file/path.min.js');
      assert.strictEqual(result, 'some/file/path.min');
    });
  });
});
