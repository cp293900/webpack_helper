const webpack_base = require('./webpack.config.base');

const webpack_prod = Object.assign({}, webpack_base);

webpack_prod.mode = 'production';
webpack_prod.output.filename = 'app.min.js';

module.exports = webpack_prod;