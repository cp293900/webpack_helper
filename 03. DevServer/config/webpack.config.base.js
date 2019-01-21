const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist')
    },
    devServer: {
        contentBase: [
            path.resolve(__dirname, '../dist'),
            path.resolve(__dirname, '../views')
        ],
        port: 9000,
        open: true,
        compress: true,
        watchContentBase: true
    }
};