const gulp = require('gulp');
const stylus = require('gulp-stylus');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const svgSprite = require('gulp-svg-sprite');
const del = require('del');
const ghpages = require('gh-pages');
const sync = require('browser-sync');

// Clean

gulp.task('clean', function () {
    return del('dist');
});

// Copy

gulp.task('copy', function () {
    return gulp
        .src([
            'src/*.html',
            'src/fonts/**/*',
            'src/scripts/**/*',
            'src/images/**/*',
            '!src/images/sprite',
            '!src/images/sprite/**/*',
        ], {
            base: 'src'
        })
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream());
});

// Styles

gulp.task('styles', function () {
    return gulp
        .src('src/styles/style.styl')
        .pipe(stylus())
        .pipe(autoprefixer())
        .pipe(csso())
        .pipe(gulp.dest('dist/styles'))
        .pipe(sync.stream());
});

// Sprite

gulp.task('sprite', function () {
    return gulp
        .src('src/images/sprite/*')
        .pipe(svgSprite({
            shape: {
                dimension: {
                    maxWidth: 500,
                    maxHeight: 500
                },
                spacing: {
                    padding: 0
                },
                transform: [{
                    "svgo": {
                        "plugins": [
                            {
                                removeUselessStrokeAndFill: true
                            },
                            {
                                removeComments: true
                            },
                            {
                                removeEmptyAttrs: true
                            },
                            {
                                removeEmptyText: true
                            },
                            {
                                collapseGroups: true
                            },
                            {
                                removeAttrs: {
                                    attrs: '(fill|stroke|style)'
                                }
                            }
                        ]
                    }
                }]
            },
            mode: {
                symbol: {
                    dest : '.',
                    sprite: 'sprite.svg'
                }
            }
        }))
        .pipe(gulp.dest('dist/images/'))
        .pipe(sync.stream());
});

// Server

gulp.task('server', function() {
    sync.init({
        ui: false,
        notify: false,
        server: {
            baseDir: 'dist'
        }
    });
});

// Watch

gulp.task('watch', function() {
    gulp.watch([
        'src/*.html',
        'src/fonts/**/*',
        'src/scripts/**/*',
        'src/images/!(sprite)/*',
        'src/images/*',
    ], gulp.series('copy'));
    gulp.watch('src/styles/**/*.styl', gulp.series('styles'));
    gulp.watch('src/images/sprite/*', gulp.series('sprite'));
});

// Build

gulp.task('build', gulp.series(
    'clean',
    'copy',
    'styles',
    'sprite'
));

// Push build to gh-pages

gulp.task('deploy', function () {
    return ghpages.publish('dist');
});

// Start

gulp.task('start', gulp.series(
    gulp.parallel('build'),
    gulp.parallel(
        'watch',
        'server'
    )
));
