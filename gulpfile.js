
const { src, dest, watch, series, parallel } = require('gulp');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');


function buildHtml() {
  return src('./app/pug/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(dest('./dist'));
}

/*function AutoPrefixer() {
  return src('./dist/css/style.css')
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(dest('./dist/css/'));
}*/

function buildCss() {
  return src('./app/sass/style.sass')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false,
      overrideBrowserslist: [
        'last 2 versions'
      ]
    }))
    .pipe(sourcemaps.write())
    .pipe(dest('./dist/css/'));
}

function buildFont() {
  return src('./app/font/*')
  .pipe(dest('./dist/font'))
}

function buildImg() {
  return src('./app/img/*')
  .pipe(imagemin())
  .pipe(dest('./dist/img'))
}

function buildLibs() {
  return src('./app/libs/**/*')
  .pipe(dest('./dist/libs/'))
}

function buildJs() {
  return src('./app/js/**/*')
  .pipe(dest('./dist/js/'))
}


function serve() {
  browserSync.init({
    server: './dist', 
    notify: false
  });
  watch('./app/pug/**/*.pug', buildHtml).on('change', () => browserSync.reload());
  watch('./app/sass/**/*.sass', buildCss).on('change',() => browserSync.reload() );
  watch('./app/img/**/*', buildImg).on('change',() => browserSync.reload() );
  watch('./app/js/**/*', buildJs).on('change',() => browserSync.reload() );
}


exports.default = series(parallel(buildHtml, buildCss, buildFont, buildImg, buildLibs, buildJs), serve)
