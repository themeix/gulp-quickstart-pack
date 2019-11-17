/*!
 * Themeix Gulp Package (https://themeix.com/)
 * Copyright 2016-2019 themeix team
 * Licensed under MIT
 * Available Main Task Command : production, gulp, zip
 */

(function() {
    'use strict';
/*
=============================
	Configure Options & Files 
=============================
*/
    var File_Name = 'html-protea.zip';
    var CSS_Files = [
      
	'./assets/css/bootstrap.min.css',	
	'./assets/css/owl.carousel.min.css',
	'./assets/css/aos.css',
	'./assets/css/prism.css',
	'./assets/css/lightbox.min.css',
	'./assets/css/icofont.min.css',
	'./assets/css/slimmenu-menu.css'
		
    ];
    var JS_Files = [
	'./assets/js/jquery.min.js',
	'./assets/js/bootstrap.min.js',
	'./assets/js/owl.carousel.min.js',
	'./assets/js/aos.js',
	'./assets/js/jquery.fitvids.js',
	'./assets/js/prism.js',
	'./assets/js/jquery.scrollUp.min.js',
	'./assets/js/infinite-scroll.pkgd.min.js',
	'./assets/js/slimmenu-menu.js',
	'./assets/js/app.js'
    ];
	
    var Production_CSS_Files = [
	'./dist/production/assets/css/bootstrap.min.css',	
	'./dist/production/assets/css/owl.carousel.min.css',
	'./dist/production/assets/css/aos.css',
	'./dist/production/assets/css/prism.css',
	'./dist/production/assets/css/lightbox.min.css',
	'./dist/production/assets/css/icofont.min.css',
	'./dist/production/assets/css/slimmenu-menu.css',
	'./dist/production/assets/css/style.min.css'
    ];	
	
    var Production_JS_Files = [
	'./dist/production/assets/js/jquery.min.js',
	'./dist/production/assets/js/bootstrap.min.js',
	'./dist/production/assets/js/owl.carousel.min.js',
	'./dist/production/assets/js/aos.js',
	'./dist/production/assets/js/jquery.fitvids.js',
	'./dist/production/assets/js/infinite-scroll.pkgd.min.js',
	'./dist/production/assets/js/jquery.scrollUp.min.js',
	'./dist/production/assets/js/lightbox.min.js',
	'./dist/production/assets/js/prism.js',
	'./dist/production/assets/js/slimmenu-menu.js',
	'./dist/production/assets/js/app.js'	
 
    ];	
/*
=============================
	Include Gulp & Plugins
=============================
*/
	var gulp 			= require('gulp'),

		sass 			= require('gulp-sass'),
		cleanCSS 		= require('gulp-clean-css'),
		autoprefixer 	= require('gulp-autoprefixer'),
		concat 			= require('gulp-concat'),		
		rename 			= require('gulp-rename'),
		uglify 			= require('gulp-uglify'),
		terser 			= require('gulp-terser'),
		jshint 			= require('gulp-jshint'),
		plumber			= require('gulp-plumber'),
		c 				= require('ansi-colors'),
		replace 		= require('gulp-replace'),
		size 			= require('gulp-size'),
		zip 			= require('gulp-zip'),
		del 			= require('del'),
		gulpCopy 		= require('gulp-copy'),
		runSequence 	= require('run-sequence'),
		inject 			= require('gulp-inject')
//		fs 				= require('fs');
		
		sass.compiler = require('gulp-sass');
			
  
 
    gulp.task('clean-production', function() {
        return del('dist/**/**', {
            force: true
        });
    });
    gulp.task('copy_css_files', function(done) {
        return gulp.src(CSS_Files)
            .pipe(gulp.dest('./dist/production/assets/css'))
            .pipe(size())

        done();
    });
    gulp.task('copy_js_files', function(done) {
        return gulp.src(JS_Files)
            .pipe(gulp.dest('./dist/production/assets/js'))
            .pipe(size())

        done();
    });
	
    gulp.task('copy_all_files', function(done) {
        return gulp.src([
                './**/*',
                '!.editorconfig',
                '!.jshintignore',
                '!.jshintrc',
                '!bower.json',
                '!gulpfile.js',
                '!package.json',
                '!package-lock.json',
                '!.gitattributes',
                '!gitignore',
                '!README.md',
                '!.gitignore',
                '!./node_modules/**',
                '!./bower_components/**',
                '!./dist/**',
                '!./git/**'
            ])
            .pipe(gulp.dest('./dist/production'))
            .pipe(size())
        done();
    });

    gulp.task('inject_code_html', function(cb) {
        return gulp.src('./dist/production/*.html') //file with tags for injection
            .pipe(inject(gulp.src(Production_JS_Files), {
                starttag: '<!-- gulp:{{ext}} -->',
                endtag: '<!-- endgulp -->',
                relative: true
            }))
            .pipe(gulp.dest('./dist/production')); //where index.html will be saved. Same dir for overwrite old one
    })
    gulp.task('inject_code_html_2', function(cb) {
        return gulp.src('./dist/production/*.html') //file with tags for injection
            .pipe(inject(gulp.src(Production_CSS_Files), {
                starttag: '<!-- gulp:{{ext}} -->',
                endtag: '<!-- endgulp -->',
                relative: true
            }))
            .pipe(gulp.dest('./dist/production')); //where index.html will be saved. Same dir for overwrite old one
    })

    gulp.task('remove_extra_code', function() {
        return gulp.src('./dist/production/*.html')
            .pipe(replace('<link rel="stylesheet" href="assets/css/app.min.css">', ''))
            .pipe(replace('<script src="assets/js/build.min.js"></script>', ''))
            .pipe(gulp.dest('./dist/production'))
    });

 
	
    gulp.task('production-zip', function(done) {
        gulp.src([
                './dist/production/**/*',
            ])
            .pipe(zip('production-' + File_Name))
            .pipe(gulp.dest('./dist/'))
            .pipe(size())
        done();
    });

    gulp.task('sass', function(done) {
        return gulp.src('./assets/scss/*.scss')
            .pipe(plumber({
               // errorHandler: onError
            }))
            .pipe(sass())
            .pipe(autoprefixer())
            .pipe(gulp.dest('./assets/css'))
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(cleanCSS())
            .pipe(gulp.dest('./assets/css'))
            .pipe(size())
        done();
    });


    gulp.task('vendor_css', function(done) {
        return gulp.src(CSS_Files)
            .pipe(concat('vendors.css'))
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(cleanCSS())
            .pipe(gulp.dest('./assets/css'))
            .pipe(size())
        done();
    });

    gulp.task('js', function(done) {
        return gulp.src(JS_Files)

            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(concat('build.js'))
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(terser())
            .pipe(gulp.dest('./assets/js'))
            .pipe(size())
        done();
    });


    gulp.task('app_css', function(done) {
        return gulp.src(['./assets/css/vendors.min.css', './assets/css/style.min.css'])
            .pipe(concat('app.css'))
            .pipe(cleanCSS())
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(gulp.dest('./assets/css'))
            .pipe(size())
        done();
    });
    gulp.task('zip', function(done) {
        gulp.src([
                './**/*',
                '.editorconfig',
                '.jshintignore',
                '.jshintrc',
                '!.gitattributes',
                '!README.md',
                '!.gitignore',
                '!./node_modules/**',
                '!./bower_components/**',
                '!./dist/**',
                '!./git/**'
            ])
			.pipe(zip('dev-' + File_Name))
            .pipe(gulp.dest('dist'))
            .pipe(size())
        done();
    });

    gulp.task('watch', function() {
        gulp.watch('assets/scss/**/*.scss', gulp.series('build_css'));
        gulp.watch(['./assets/js/app.js'], gulp.series('js'));
    });

    gulp.task(
        'build_css',
        gulp.series('sass', 'vendor_css', 'app_css')
    );

    gulp.task(
        'build',
        gulp.series('build_css', 'js')
    );

    gulp.task(
        'production',
        gulp.series('clean-production', 'copy_all_files', 'copy_css_files', 'copy_js_files', 'inject_code_html', 'inject_code_html_2', 'remove_extra_code', 'production-zip', 'zip')
    );

 

    gulp.task(
        'default',
        gulp.series('build', 'watch')
    );

})();
