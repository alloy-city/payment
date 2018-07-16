const path = require('path');

const opts = {
    DEBUG: true,
    "ifdef-verbose": true,
    "ifdef-triple-slash": true
};

module.exports = {
    entry: './src/main.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    { loader: "ts-loader" },
                    { loader: "ifdef-loader", options: opts }
                ],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'payment-bundle.js',
        path: path.resolve("../../Alloy-Server-v3.0/apps/pantoufle/public/static-files/modules")
    },
    mode: 'development',
    devtool: "inline-source-map"
};