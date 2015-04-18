var path = require("path");
var webpack = require("webpack"), fs = require('fs');
module.exports = {
    watch: false,
    module: {
        loaders: [
            {
                include: [
                    path.resolve(__dirname, "main/assets/js"),
                    path.resolve(__dirname, "test/js"),
                    fs.realpathSync(path.resolve(__dirname, "node_modules/flexcss"))
                ],
                test: /\.jsx?$/,
                loader: 'babel-loader?experimental&optional=runtime&sourceMap=inline'
            }
        ],
        postLoaders: [{ //
            test: /\.js$/,
            exclude: /(test|node_modules|bower_components|test_helpers)\//,
            loader: 'istanbul-instrumenter'
        }]
    },
    resolve: {
        // add bower components and main source to resolved
        root: [path.join(__dirname, "bower_components"),
            path.join(__dirname, 'test/js'),
            path.join(__dirname, 'test/js_helpers'),
            path.join(__dirname, 'node_modules/flexcss/src/main')]
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
    ]
};