var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var uglifycss = require("gulp-uglifycss");
var browserSync = require('browser-sync').create();
var rename = require("gulp-rename");

var path = {
    scssSource: "./scss/**/*.scss",
    cssDest: "./dist/css"
};

gulp.task('js', function () {
    return gulp.src(['./js/*.js'])
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('sass', function () {

    return gulp
        .src(path.scssSource)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(
            {
                browsers: ['last 3 versions']
            }
        ))
        .pipe(uglifycss()).pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest(path.cssDest))
        .pipe(browserSync.stream());
});

gulp.task('serve', ['sass', 'js'], function () {
    browserSync.init({ server: './'});
    gulp.watch(path.scssSource, ["sass"]);
    gulp.watch('./js/*.js', ["js"]);
    gulp.watch(["./*.html", "./dist/css/*.css", "./dist/js/*.js"]).on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
