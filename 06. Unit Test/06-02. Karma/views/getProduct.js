module.exports = function page_init() {
    const getProduct = require('../src/product');
    
    let getIntById = function(id) {
        return parseInt(document.getElementById(id).value, 10);
    };
    
    let calculate = function() {
        let result = getProduct(getIntById('a'), getIntById('b'));
        document.getElementById('result').innerHTML = isNaN(result) ? 0 : result;
    }
    
    let btn_getProduct = document.getElementById('btn_getProduct');
    if(btn_getProduct) {
        btn_getProduct.addEventListener('click', calculate);
    }
}