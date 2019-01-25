const assert = require('assert');
const app = require('../src/app');

describe('Test', () => {
  it('should return 5', () => {
    assert.equal(app.getAvg([1, 2, 3, 4, 5, 6, 7, 8, 9]), 5);
  });

  it('should return 8', () => {
    assert.equal(app.getMax([3, 8, 5, 7]), 8);
  });

  it('should return 3', () => {
    assert.equal(app.getMin([3, 8, 5, 7]), 5);
  });
})