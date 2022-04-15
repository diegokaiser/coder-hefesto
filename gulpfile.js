const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant");
const uglify = require("gulp-uglify-es").default;
const concat = require("gulp-concat");
var version = require("gulp-version-number");
const browser = require("browser-sync").create();

const vconfig = {
  value: "%MDS%",
  append: {
    key: "v",
    to: ["css", "js"],
  },
  output: {
    file: "version.json",
  },
};

sass.compiler = require("node-sass");

let paths = {
  scripts: {
    src: "./source/javascript/modules/**/*.js",
    dest: "./dist/assets/js",
  },
  vendor: {
    src: "./source/javascript/plugins/**/*.js",
    dest: "./dist/assets/js",
  },
  images: {
    src: "./source/assets/images/**.*",
    dest: "./dist/assets/images",
  },
};

gulp.task("styles", () => {
  return gulp
    .src("./source/sass/*.scss")
    .pipe(
      sass({
        outputStyle: "compressed",
      })
    )
    .pipe(
      autoprefixer({
        browsers: "last 2 versions",
      })
    )
    .pipe(gulp.dest("./dist/assets/css"))
    .pipe(browser.stream());
});

gulp.task("pug", () => {
  return gulp
    .src("./source/layouts/**/*.pug")
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(gulp.dest("./dist/"))
    .pipe(browser.stream());
});

gulp.task("javascript", () => {
  return gulp
    .src(paths.scripts.src, {
      sourcemaps: true,
    })
    .pipe(concat("app.js"))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browser.stream());
});

gulp.task("vendor", () => {
  return gulp
    .src(paths.vendor.src, {
      sourcemaps: true,
    })
    .pipe(concat("vendor.js"))
    .pipe(gulp.dest(paths.vendor.dest))
    .pipe(browser.stream());
});

gulp.task("images", () => {
  return gulp
    .src(paths.images.src, {
      sourcemaps: false,
    })
    .pipe(
      imagemin({
        progressive: true,
        interlaced: true,
        optimizationLevel: 2,
        svgoPlugins: [
          {
            removeViewBox: false,
          },
        ],
        use: [
          pngquant({
            quality: "75-80",
            speed: 4,
          }),
        ],
      })
    )
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browser.stream());
});

gulp.task("versions", () => {
  return gulp
    .src("./dist/**/*.html")
    .pipe(version(vconfig))
    .pipe(gulp.dest("./dist/"))
    .pipe(browser.stream());
});

gulp.task("browser", () => {
  browser.init({
    open: true,
    server: "./dist",
    port: 4000,
  });
});

gulp.task("watch", () => {
  gulp.watch("source/sass/**/**/*.scss", gulp.series("styles"));
  gulp.watch("source/javascript/**/*.js", gulp.series("javascript"));
  gulp.watch("source/layouts/**/*.pug", gulp.series("pug"));
});

gulp.task(
  "default",
  gulp.parallel(
    "styles",
    "pug",
    "watch",
    "javascript",
    "vendor",
    "images",
    "versions",
    "browser"
  )
);
