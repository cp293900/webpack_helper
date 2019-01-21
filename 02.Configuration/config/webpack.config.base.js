const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, '../dist')
    },
    devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, '../'),
        compress: true,
        port: 9000
    }
};