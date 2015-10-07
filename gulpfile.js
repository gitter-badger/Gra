
var gulp = require('gulp');  
var less = require('gulp-less'); // compiles less to CSS
var sass = require('gulp-sass'); // compiles sass to CSS
var notify = require('gulp-notify');
var minify = require('gulp-minify-css'); // minifies CSS
var concat = require('gulp-concat');
var uglify = require('gulp-uglify'); // minifies JS
var rename = require('gulp-rename');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var phpunit = require('gulp-phpunit');
var htmlmin = require('gulp-htmlmin');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var rucksack = require('gulp-rucksack');
//var elixir = require('laravel-elixir');





/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Less
 | file for our application, as well as publishing vendor resources.
 |
 */

gulp.task('bootstrap', function() {

	livereload.listen();
	return gulp.src('./resources/assets/less/bootstrap.less')
		.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		.pipe(less())
		.pipe(gulp.dest('./public_html/css/'))
		.pipe(livereload())
		.pipe(minify({keepSpecialComments: 0}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./public_html/css/'))
		.pipe(notify('Bootstrap compiled'))
		.pipe(livereload());
});





gulp.task('theme', function() {

	livereload.listen();
	return gulp.src('./resources/assets/less/theme.less')
		.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		.pipe(less())
		.pipe(gulp.dest('./public_html/css/'))
		.pipe(livereload())
		.pipe(minify({keepSpecialComments: 0}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./public_html/css/'))
		.pipe(notify('Theme compiled'))
		.pipe(livereload());
});





gulp.task('coffee', function() {

	livereload.listen();
	return gulp.src('./resources/assets/coffee/**/*.coffee')
		.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		.pipe(sourcemaps.init())
		.pipe(coffee())
		.pipe(concat('app.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./public_html/js'))
		.pipe(livereload())
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./public_html/js/'))
		.pipe(notify('Coffeescript compiled'))
		.pipe(livereload());
});


gulp.task('clean', function() {

});




gulp.task('scripts', function() {

	return gulp.start('coffee');
});

gulp.task('styles', function() {

	return gulp.start('bootstrap', 'theme');
});

gulp.task('all', function() {

	return gulp.start('styles', 'scripts');
});

gulp.task('watch', function() {

	livereload.listen();
	gulp.watch('./resources/assets/coffee/**/*.coffee', ['coffee']);
	gulp.watch('./resources/assets/less/theme.less', ['theme']);
	gulp.watch('./resources/assets/less/bootstrap.less', ['bootstrap']);
});





gulp.task('rucksack', function() {
  return gulp.src('./public_html/sass/custom_style.css')
    .pipe(rucksack())
    .pipe(gulp.dest('./public_html/sass/'));
});

/*
elixir(function(mix) {

	mix.less().coffee();
});
*/