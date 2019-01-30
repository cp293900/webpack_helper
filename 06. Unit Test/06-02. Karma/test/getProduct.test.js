const assert = require('assert');
const page_init = require('../views/getProduct');

describe('Test', () => {
    beforeEach(function() {
        fixture.base = 'views';
        fixture.load('getProduct.html');
        page_init();
    });

    afterEach(function() {
        fixture.cleanup();
    });

    let calculate = function(a, b) {
        document.getElementById('a').value = a;
	    document.getElementById('b').value = b;
        document.getElementById('btn_getProduct').click();
        return parseInt(document.getElementById('result').innerHTML, 10);
    }

    it('should return 8 for 2 x 4', () => {
        assert.equal(calculate(2, 4), 8);
    });

    it('should return 24 for 6 x 4', () => {
        assert.equal(calculate(6, 4), 24);
    });

    it('should return 0 for invalid a value', () => {
        assert.equal(calculate('hello', 9), 0);
    });

    it('should return 0 for invalid b value', () => {
        assert.equal(calculate(0, 'hi'), 0);
    });
});