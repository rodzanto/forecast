const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: {
                    loader: "html-loader"
                }
            },
            {
                test: /\.css$/i,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"}
                ]
            },
            {
                test: /\.(gif|svg|jpg|png)$/,
                loader: "file-loader",
                options: {
                    outputPath: 'images',
                },
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),
        new CopyPlugin([
            {from:'./src/js/forecast.js', to:'./js/forecast.js'},
            {from:'./src/js/aws-sdk-2.554.0.min.js', to:'./js/aws-sdk-2.554.0.min.js'},
            {from:'./src/images/favicon.png', to:'./images/favicon.png'}
        ]),
    ]
};