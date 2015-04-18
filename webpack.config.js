var path = require("path");
var webpack = require("webpack"), fs = require('fs');
module.exports = {
    watch: false,
    devtool: "source-map",
    module: {
        loaders: [
            {
                include: [
                    path.resolve(__dirname, "main/assets/js"),
                    fs.realpathSync(path.resolve(__dirname, "node_modules/flexcss"))
                ],
                test: /\.jsx?$/,
                loader: 'babel-loader?experimental&optional=runtime&sourceMap=inline'
            }
        ],
        preLoaders: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "main/assets/js")
                ],
                loader: "jshint-loader"
            }
        ]
    },
    resolve: {
        // add bower components, main source and flexcss framework (for internal resolves) to resolve requires
        root: [
            path.join(__dirname, "node_modules"),
            path.join(__dirname, "bower_components"),
            path.join(__dirname, 'main/assets/js'),
            path.join(__dirname, 'node_modules/flexcss/src/main')]
    },
    output: {
        filename: 'app.js',
        libraryTarget: 'umd',
        library: 'App',
        sourceMapFilename: 'app.map'
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ),
        new webpack.optimize.UglifyJsPlugin()
    ]
};