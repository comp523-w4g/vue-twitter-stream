"use strict";

const cleanCSS = require('gulp-clean-css');
const connect = require('gulp-connect');
const connectHistory = require('connect-history-api-fallback');
const del = require('del');
const gulp = require('gulp');
const less = require('gulp-less');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

gulp.task('webpack:build', () => {
  return gulp.src('src/js/main.js')
    .pipe(webpackStream(Object.assign({},
      webpackConfig, {
        watch: true
      })))
    .pipe(gulp.dest('public/js/'))
});

gulp.task('webpack:watch', () => {
  return gulp.src('src/js/main.js')
    .pipe(webpackStream(Object.assign({},
      webpackConfig, {
        watch: true
      }
    )))
    .pipe(gulp.dest('public/js/'))
    .pipe(connect.reload());
});

gulp.task('clean', done => {
  del('./public/**/*').then(() => {
    done()
  });
});

gulp.task('serve', () => {
  connect.server({
    livereload: true,
    root: 'public',
    middleware: (connect, opt) => {
      return [
        connectHistory()
      ];
    }
  });
});

gulp.task('build:index', () => {
  return gulp.src('./src/index.html')
    .pipe(gulp.dest('./public'));
});

gulp.task('build:less', () => {
  return gulp.src('./src/css/main.less')
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(rename('app.css'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('copy:fonts', () => {
  return gulp.src('./node_modules/materialize-css/dist/fonts/**/*')
    .pipe(gulp.dest('./public/assets/fonts'));
});

gulp.task('copy:iconfont', () => {
  let base = './node_modules/material-design-icons/iconfont';
  return gulp.src([
      `${base}/*.eot`,
      `${base}/*.ttf`,
      `${base}/*.woff`,
      `${base}/*.woff2`
    ])
    .pipe(gulp.dest('./public/assets/fonts/materialicons'));
});

gulp.task('copy:icons', () => {
  let base = './node_modules/material-design-icons/iconfont';
  return gulp.src('./node_modules/flat-color-icons/svg/*.svg')
    .pipe(gulp.dest('./public/assets/icons'));
});

gulp.task('copy:assets', () => {
  return gulp.src('./src/assets/**/*')
    .pipe(gulp.dest('./public/assets'));
});

gulp.task('copy', [
  'copy:fonts', 'copy:iconfont', 'copy:icons', 'copy:assets'
]);

gulp.task('build', done => {
  process.env.NODE_ENV = 'production';

  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }));

  runSequence(
    'clean', ['webpack:build', 'copy', 'build:index', 'build:less'],
    done
  );
});

gulp.task('dev-build', done => {
  runSequence(
    'clean', ['webpack:build', 'copy', 'build:index', 'build:less'],
    done
  );
});

gulp.task('watch', done => {
  runSequence(
    'clean', ['webpack:watch', 'serve', 'copy', 'build:index', 'build:less'],
    done
  );
});

gulp.task('default', ['build']);
