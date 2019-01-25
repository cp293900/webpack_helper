const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'none',
    entry: './test/test.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'test.js'
    },
    module: {
        rules: [
            {
                loader: 'mocha-loader',
                test: /test\.js$/,
                exclude: /node_modules/
            }
        ]
    }
}