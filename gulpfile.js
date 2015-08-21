
var gulp = require('gulp');  
var less = require('gulp-less'); // compiles less to CSS
var sass = require('gulp-sass'); // compiles sass to CSS
var minify = require('gulp-minify-css'); // minifies CSS
var concat = require('gulp-concat');
var uglify = require('gulp-uglify'); // minifies JS
var rename = require('gulp-rename');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var phpunit = require('gulp-phpunit');
var htmlmin = require('gulp-htmlmin');
var sourcemaps = require('gulp-sourcemaps');
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

	return gulp.src('./resources/assets/less/bootstrap.less')
		//.pipe(sourcemaps.init())
		.pipe(less())
		//.pipe(sourcemaps.write())
		.pipe(gulp.dest('./public/css/'))
		.pipe(minify({keepSpecialComments: 0}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./public/css/'));
});

gulp.task('theme', function() {

	return gulp.src('./resources/assets/less/theme.less')
		//.pipe(sourcemaps.init())
		.pipe(less())
		//.pipe(sourcemaps.write())
		.pipe(gulp.dest('./public/css/'))
		.pipe(minify({keepSpecialComments: 0}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./public/css/'));
});


gulp.task('coffee', function() {

	return gulp.src('./resources/assets/coffee/**/*.coffee')
		.pipe(sourcemaps.init())
		.pipe(coffee())
		.pipe(concat('app.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./public/js'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./public/js/'));
});

gulp.task('js', function() {

	//return gulp.src('./resources/assets/js/**/*.js')
	//	.pipe(concat('app.js'))
	//	.pipe(gulp.dest('./public/js/'))
	//	.pipe(minify({keepSpecialComments: 0}))
	//	.pipe(rename({suffix: '.min'}))
	//	.pipe(gulp.dest('./public/js/'));
});

gulp.task('templates', function() {

	var opts = {
		collapseWhitespace: true,
		removeAttributeQuotes: true,
		removeComments: true,
		minifyJS: true
	};

	return gulp.src('./storage/framework/views/**/*')
		.pipe(htmlmin(opts))
		.pipe(gulp.dest('./storage/framework/views/'));
});


gulp.task('scripts', function() {

	return gulp.start('coffee', 'js');
});

gulp.task('styles', function() {

	return gulp.start('bootstrap', 'theme');
});

gulp.task('all', function() {

	return gulp.start('templates', 'styles', 'scripts');
});




/*
elixir(function(mix) {

	mix.less().coffee();
});
*/