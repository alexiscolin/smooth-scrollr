const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                    presets: ['@babel/preset-env']
                    }
                }
            }
        ],   
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    output: {
        filename: 'smooth-scrollr.js',
        path: path.resolve(__dirname, 'dist'),
    },
};