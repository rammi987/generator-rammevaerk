'use strict';

const production      = process.env.NODE_ENV === 'production' ? true : false;
const gulp            = require('gulp');
const sourcemaps      = require('gulp-sourcemaps');
const rename          = require('gulp-rename');
const plumber         = require('gulp-plumber');
const gutil           = require('gulp-util');
const sass            = require('gulp-sass');
const postcss         = require('gulp-postcss');
const conf            = require('../config');

// Generate solution styles
gulp.task('styles', () => {
    const processors = [
        require('autoprefixer')({browsers: conf.browserSupport}),
        require('postcss-responsive-type'),
        require('postcss-clearfix')
    ];

    if (!global.isWatching) {
        processors.push(require('cssnano')({
            autoprefixer: false,
            discardDuplicates: false,
            orderedValues: false,
            svgo: false
        }));
    }

    return gulp.src([conf.css.src + '/**/' + 'screen.scss'])
        .pipe(plumber({
            errorHandler: function (err) {
                gutil.log('Filename: ', gutil.colors.bold.red(err.file));
                gutil.log('Linenumber: ', gutil.colors.bold.red(err.line));
                gutil.log('Extract: ', gutil.colors.bold.red(err.message));
                gutil.beep();
                this.emit('end');
            }
        }))
        .pipe(production ? gutil.noop() : sourcemaps.init())
        .pipe(sass({includePaths: ['node_modules']}))
        .pipe(postcss(processors))
        .pipe(rename(function(path){
            path.basename = path.basename + '.min';
        }))
        .pipe(production ? gutil.noop() : sourcemaps.write('./', {includeContent: false, sourceRoot: conf.css.src}))
        .pipe(gulp.dest(conf.css.dest))
        .on('error', gutil.log);
});
