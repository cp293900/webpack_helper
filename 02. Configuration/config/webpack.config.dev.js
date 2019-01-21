const webpack_base = require('./webpack.config.base');

const webpack_dev = Object.assign({}, webpack_base);

webpack_dev.devtool = 'none',

module.exports = webpack_dev;