const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');

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
    },
    plugins: [
        new CleanWebpackPlugin([
            '../dist'
        ], {
                allowExternal: true
            })
    ],
    module: {
        rules: [
            {
                loader: "babel-loader",
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    }
};