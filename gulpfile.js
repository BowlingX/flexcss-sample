/*
 * Build file for flexcss-sample
 * @author David Heidrich (me@bowlingx.com)
 */

var gulp = require('gulp');

// serve all plugins under $ and remove gulp prefix
var $ = require('gulp-load-plugins')({
    replaceString: /^gulp(-|\.)([0-9]+)?/
});

// other Libraries
var
    del = require('del'),
    autoprefixer = require('autoprefixer-core'),
    argv = require('yargs').argv,
    csswring = require('csswring'),
    webpackConfig = require("./webpack.config.js"),
    runSequence = require('run-sequence'), rimraf = require('rimraf');

var sass = require('gulp-sass');

var paths = {
    scripts: ['main/assets/js/**/*.js'],
    exports: ['main/assets/js/export.js'],
    tests: ['test/js/**/*.js'],
    images: ['main/assets/img/**/*', 'themes/img/**/*'],
    fonts: ['main/assets/fonts/**/*', 'node_modules/flexcss/assets/fonts/**/**.*'],
    asset_dist: './build',
    mainAssets: 'main/assets/css/**/*.scss',
    htmlPrototype: 'html/**.html',
    // Karma config file
    karmaConfig: 'karma.conf.js',
    flexCssPath:'node_modules/flexcss/assets/**/*.scss'
};

var buildPaths = paths.asset_dist;

var onError = function (err) {
    $.util.beep();
    console.log(err);
    // continue:
    this.emit('end');
};

// cleans build directory
gulp.task('clean', function (cb) {
    return rimraf(paths.asset_dist, cb);
});

function createScripts(watch, dest) {
    var path = require("path");
    dest = dest ? dest : buildPaths + '/js';
    var config = Object.create(webpackConfig);
    config.watch = watch;
    return gulp.src(paths.exports)
        .pipe($.plumber({
            errorHandler: onError
        }))
        .pipe($.webpack(config))
        .pipe(gulp.dest(dest))
        .pipe($.connect.reload());
}

gulp.task('compileScriptsWithDependencies', function () {
    return createScripts(false);
});

gulp.task('watchScriptsWithDependencies', function () {
    return createScripts(true);
});

// setup tests
gulp.task('test', function () {
    return gulp.src('./doesNotExists')
        .pipe($.karma({
            configFile: paths.karmaConfig,
            action: argv.watch ? 'watch' : 'run',
            reporters: argv.writeTestResults ? ['progress', 'junit', 'coverage'] : ['progress', 'coverage']
        }))
        .on('error', function (err) {
            // Make sure failed tests cause gulp to exit non-zero
            $.util.beep();
            throw err;
        });
});

// Copy all static images
gulp.task('images', function () {
    return gulp.start('imagesReload');
});

gulp.task('imagesReload', function () {
    return gulp.src(paths.images)
        // Pass in options to the task
        .pipe($.imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest(buildPaths + '/img'));
});

function fonts(dest) {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest(dest));
}

gulp.task('fonts', function () {
    return fonts(buildPaths + '/fonts');
});

function compileSass(path, dist) {
    var processors = [
        autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }),
        csswring
    ];

    return gulp.src(path)
        .pipe($.plumber({
            errorHandler: onError
        }))
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            includePaths: ['node_modules']
        }))
        .pipe($.postcss(processors))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(dist))
        .pipe($.connect.reload());
}

gulp.task('compileSass', function () {
    return compileSass(paths.mainAssets, buildPaths + '/css');
});

// Rerun the task when a file changes
gulp.task('watch', function () {
    // scripts and images
    // sass
    gulp.watch([paths.mainAssets], ['compileSass']);
    gulp.watch(paths.images, ['imagesReload']);
    gulp.watch(paths.htmlPrototype, ['html']);
});

gulp.task('html', function () {
    gulp.src(paths.htmlPrototype)
        .pipe($.connect.reload());
});

// webserver
gulp.task('webserver', function () {
    $.connect.server({
        port: 5757,
        root: ['./html', 'build'],
        livereload: true
    });
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', function (callback) {
    runSequence('clean', ['webserver', 'html', 'watch', 'fonts', 'images', 'compileSass', 'watchScriptsWithDependencies'], callback);
});

gulp.task('dist', function (callback) {
    runSequence('clean', ['fonts', 'images', 'compileSass', 'compileScriptsWithDependencies'], callback);
});