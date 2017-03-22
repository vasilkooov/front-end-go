'use strict';


//  -------- Используемые ------
var gulp = require('gulp'),
    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),

    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),

    browserSync = require("browser-sync"),
    reload = browserSync.reload;


//  --------- Пути -----
var path = {
    public: { //Здесь укажем куда складывать готовые после сборки файлы
        html: 'public/',
        style: 'public/style/',
        js: 'public/js/',
        img: 'public/img/',
        font: 'public/font/'
    },

    frontend: { //Пути откуда брать исходники
        html: 'frontend/tmpl/*.jade',
        style: 'frontend/style/main.sass',
        js: 'frontend/js/main.js',
        img: 'frontend/img/**/*.*',
        font: 'frontend/font/**/*.*'
    },

    watch: { // Наблюдаем за ..
        html: 'frontend/**/*.jade',
        style: 'frontend/style/**/*.sass',
        js: 'frontend/js/**/*.js',
        img: 'frontend/img/**/*.*',
        font: 'frontend/font/**/*.*',
    },

    // Отчистка исходной папки, при удалении файла, ОБНОВЛЕНИЕ
    clean: './public'
};

// Настройка сервера
var config = {
    server: {
        baseDir: "./public"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Boo"
};

// ------- Сборка -------
gulp.task('jade', function () {
    return gulp.src(path.frontend.html)
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(path.public.html))
        .pipe(reload({stream: true}));
});

gulp.task('sass', function () {
    return gulp.src(path.frontend.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.public.style))
        .pipe(reload( {stream: true} ));
});

gulp.task('image', function() {
    return gulp.src(path.frontend.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true
        }))
        .pipe(gulp.dest(path.public.img))
        .pipe(reload( {stream: true} ));
});

gulp.task('font', function () {
    return gulp.src(path.frontend.font)
        .pipe(gulp.dest(path.public.font))
});

//  ---------- Билдим -----
gulp.task('build', [
    'jade',
    'sass',
    'js',
    'img',
    'font'
]);


//  --------- Следить за .. -----
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('jade');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('img');
    });
    watch([path.watch.font], function(event, cb) {
        gulp.start('font');
    });
});


// --------- Сервер ---------
gulp.task('webserver', function () {
    browserSync(config);
});

// -------- Очистка ----
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb)
});

// ---------- Настройка default, собирает воедино ----
gulp.task('default', ['build', 'webserver', 'watch'] );

