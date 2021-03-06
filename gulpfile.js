var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cssnano     = require('gulp-cssnano');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var cp          = require('child_process');

var messages = {
  jekyllDev: 'Running: $ jekyll build for dev',
  jekyllProd: 'Running: $ jekyll build for prod'
};

gulp.task('jekyll-dev', function (done) {
  browserSync.notify(messages.jekyllDev);
  return cp.spawn('jekyll', ['build', '--drafts', '--config', '_config.yml,_config_dev.yml'], {stdio: 'inherit'})
  .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-dev'], function () {
  browserSync.reload();
});

gulp.task('browser-sync', ['sass', 'scripts', 'jekyll-dev'], function() {
  browserSync.init({
    server: "_site",
    port: 4001
  });
});

gulp.task('sass', function () {
  return gulp.src('_sass/main.scss')
  .pipe(sass({
    includePaths: ['scss'],
    onError: browserSync.notify
  }))
  .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
  .pipe(gulp.dest('_site/css'))
  .pipe(browserSync.reload({stream:true}))
  .pipe(gulp.dest('css'));
});

gulp.task('scripts', function() {
  return gulp.src(['_js/*.js'])
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest('_site/js'))
  .pipe(browserSync.reload({stream:true}))
  .pipe(gulp.dest('js'));
});

gulp.task('watch', function () {
  gulp.watch(['_sass/**/*.scss','_sass/*.scss'], ['sass']);
  gulp.watch(['_js/**/*.js', '_js/*.js'], ['scripts']);
  gulp.watch(['index.html', '_layouts/*.html', '_posts/*', '_includes/*.html', '_drafts/*', '**/*.html'], ['jekyll-rebuild']);
});

gulp.task('jekyll-prod', function (done) {
  browserSync.notify(messages.jekyllProd);
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
  .on('close', done);
});

gulp.task('sass-prod', function () {
  return gulp.src('_sass/styles.scss')
  .pipe(sass({
    includePaths: ['scss'],
    onError: browserSync.notify
  }))
  .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
  .pipe(cssnano())
  .pipe(gulp.dest('_site/css'))
  .pipe(gulp.dest('css'));
});

gulp.task('scripts-prod', function() {
  return gulp.src(['_js/*.js'])
  .pipe(concat('scripts.js'))
  .pipe(uglify())
  .pipe(gulp.dest('_site/js'))
  .pipe(gulp.dest('js'));
});

gulp.task('default', ['browser-sync', 'watch']);

gulp.task('build', ['scripts-prod', 'sass-prod', 'jekyll-prod']);
