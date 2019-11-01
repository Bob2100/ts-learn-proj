// Gulp打包工具
var gulp = require("gulp");

// Browserify编译成浏览器环境
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");

// Watchify自动执行gulp编译
var watchify = require("watchify");
var gutil = require("gulp-util");

// Uglify混淆和压缩代码
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");

var paths = {
  pages: ['src/*.html']
};

var watchedBrowserify = watchify(browserify({
  basedir: ".",
  debug: true,
  entries: ["src/main.ts"],
  cache: {},
  packageCache: {}
}).plugin(tsify));

gulp.task("copy-html", function () {
  return gulp.src(paths.pages)
    .pipe(gulp.dest("dist"));
});

function bundle(){
  return watchedBrowserify.bundle()
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("dist"));
}

gulp.task("default", gulp.series("copy-html", bundle));
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);