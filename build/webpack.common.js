const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    entry: {
        main: "./src/entry.tsx",
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                "style-loader",
                "css-loader",
            ],
        }, {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/
        },],
    },
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "..", "dist"),
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            meta: {
                viewport: "width=device-width, initial-scale=1.0",
            },
            template: "src/index.ejs",
            title: "Video Messaging",
        }),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false,
        }),
    ],
    resolve: {
        extensions: [".js", ".ts", ".tsx"],
    },
};
