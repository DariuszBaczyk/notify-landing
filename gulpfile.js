const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const cache = require('gulp-cache');
const del = require('del');
const imagemin = require("gulp-imagemin");


function server(done) {
    return browserSync.init({
        server: {
            baseDir: 'src'
        }
    });
    done();
};

function browserSyncReload(done) {
    browserSync.reload();
    done();
  }

gulp.task('sass', function() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('useref', function() {
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});

gulp.task('images', function() {
    return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean', function() {
    return del('dist');
});

gulp.task('clearCache', function (callback) {
    return cache.clearAll(callback)
});

gulp.task('build', gulp.series(['clean', 'sass', 'useref', 'images', 'fonts']));

gulp.task('default', gulp.series(['build']));

gulp.task('watch', gulp.series(['default'], function watch() {
    gulp.watch('src/scss/**/*.scss', gulp.series(['sass']));
    gulp.watch('src/js/**/*.js', gulp.series(browserSyncReload));
    gulp.watch('src/*.html', gulp.series(browserSyncReload));
    return server();
}));