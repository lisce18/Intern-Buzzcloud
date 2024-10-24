const webpack = require("webpack");

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            // Add fallback configuration
            webpackConfig.resolve.fallback = {
                http: require.resolve("stream-http"),
                https: require.resolve("https-browserify"),
                zlib: require.resolve("browserify-zlib"),
                url: require.resolve("url/"),
                assert: require.resolve("assert/"),
                stream: require.resolve("stream-browserify"),
                crypto: require.resolve("crypto-browserify"),
            };

            // Add source-map-loader configuration
            webpackConfig.module.rules.push({
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"],
                exclude: [/node_modules\/web3/],
            });

            return webpackConfig;
        },
    },
};
