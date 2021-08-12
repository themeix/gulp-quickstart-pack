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
  var File_Name = 'ghost-theme.zip';

  var CSS_Files = [
 	'./node_modules/jquery/dist/css/bootstrap.min.css'   
      
  ];
  var JS_Files = [
	    './node_modules/jquery/dist/jquery.min.js',
      './assets/js/app.js'
  ];

  	
/*
=============================
Include Gulp & Plugins
=============================
*/
	var gulp 			= require('gulp'),
		sass 			= require('gulp-sass')(require('sass')),
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
      
// Start server
gulp.task('serve', function (done) {
  livereload.listen({
  host: 'localhost',
port: '2368',
start: true
});
  done();
});

 // Cleaning 
  gulp.task('clean-production', function() {
     return del('dist', {
          force: true
      });
  });

 // SCSS	
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
    .pipe(livereload())
      done();
  });

 // Vendor CSS	
 
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

 // App CSS	
 
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


 // js	
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
    .pipe(livereload())
      done();
  });

// Ghost Template Files
gulp.task('hbs', function(done) {
  return gulp.src('**/*.hbs')
   // .pipe(livereload())
    done();
});



 // Watch
gulp.task('watch', function() {
 gulp.watch('assets/scss/**/*.scss', gulp.series('css'));
  gulp.watch('assets/js/**/*.js', gulp.series('js'));
  gulp.watch('**/*.hbs', gulp.series('hbs'));
});

   // Zip
  gulp.task('zip', function(done) {
      gulp.src([
              './**/*',
         
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

   // Production Zip
 
  gulp.task('production-zip', function(done) {
      gulp.src([
              './dist/production/**/*',

          ])
          .pipe(zip('production-' + File_Name))
          .pipe(gulp.dest('./dist/'))
          .pipe(size())
      done();
  });



   // Copy All Files to Dist

  gulp.task('copy_all_files', function(done) {
      return gulp.src([
              './**/*',
          
              '!.jshintignore',
              '!.jshintrc',
              '!package-lock.json',
              '!.gitattributes',
              '!gitignore',
              '!README.md',
              '!.gitignore',
              '!./node_modules/**',
              '!./dist/**',
      '!./*.html',
              '!./git/**'
          ])
          .pipe(gulp.dest('./dist/production'))
          .pipe(size())
      done();
  }); 
   // Copy CSS Files to Dist 
 
  gulp.task('copy_css_files', function(done) {
      return gulp.src(CSS_Files)
           .pipe(gulp.dest('./dist/production/assets/css'))
          .pipe(size())

      done();
  });


   // Copy JS Files to Dist	 	

  gulp.task('copy_js_files', function(done) {
      return gulp.src(JS_Files)
          .pipe(gulp.dest('./dist/production/assets/js'))
          .pipe(size())

      done();
  });



  gulp.task(
      'css',
      gulp.series('sass', 'vendor_css', 'app_css')
  );

// gulp build

  gulp.task(
      'build',
      gulp.series('css', 'js', 'hbs')
  );

// gulp production

  gulp.task(
      'production',
      gulp.series('build','clean-production', 'copy_all_files', 'copy_css_files', 'copy_js_files', 'production-zip', 'zip')
  );

// gulp

  gulp.task(
      'default',
      gulp.series('build', 'watch')
  );

})();
