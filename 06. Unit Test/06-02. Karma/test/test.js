//const assert = require('assert');
//const getMax = require('../src/max');
import * as assert from 'assert';
import getMax from '../src/max';

describe('Test', () => {
  it('should return 8', () => {
    assert.equal(getMax([3, 8, 5, 7]), 8);
  });

  it('should return 10', () => {
    assert.equal(getMax([3, 8, 5, 10]), 8);
  });
})