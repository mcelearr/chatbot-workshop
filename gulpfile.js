const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const merge = require('gulp-merge-json');
const del = require('del');
const ngLang2Js = require('gulp-ng-lang2js');
const pngquant = require('imagemin-pngquant');
const runSequence = require('run-sequence');

const plugins = gulpLoadPlugins();

const clientPaths = {
    scss: ['client/scss/**/*.scss', 'client/scss/**/**/*.scss'],
    js: {
        src: ['client/js/src/*.js', 'client/js/src/**/*.js', 'client/js/src/**/**/*.js', '!client/js/src/widget/*.js'],
        vendor: [
            'client/js/vendor/angular.min.js',
            'client/js/vendor/moment.min.js',
            'client/js/vendor/chart.min.js',
            'client/js/vendor/*.js'
        ]
    },
    fonts: 'client/assets/fonts/**',
    icons: 'client/assets/icon/**',
    img: 'client/assets/img/**',
    dest: 'public/'
};

const onError = (err) => {
    plugins.notify.onError({
        title: 'Gulp',
        subtitle: 'Failure!',
        message: 'Error: <%= error.message %>',
        sound: 'Beep'
    })(err);
    this.emit('end');
};

gulp.task('widget', () => {
    gulp.src(['client/js/src/widget/widget.js'])
        .pipe(plugins.uglify())
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(`${clientPaths.dest}_js`));

    gulp.src(['client/js/src/widget/embed.js'])
        .pipe(plugins.uglify())
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(`${clientPaths.dest}_js`));
});

gulp.task('styles', () => {
    return gulp.src(clientPaths.scss)
        .pipe(plugins.plumber({
            errorHandler: onError
        }))
        .pipe(plugins.sass({
            style: 'expanded',
        }))
        .pipe(gulp.dest(`${clientPaths.dest}_css`))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(`${clientPaths.dest}_css`));
});

gulp.task('lint', () => {
    return gulp.src(clientPaths.scss)
        .pipe(plugins.plumber({
            errorHandler: onError
        }))
        .pipe(plugins.scssLint({
            bundleExec: true,
            config: '.scss-lint.yml',
            reporterOutput: 'scss-lint-report.xml'
        }));
});

gulp.task('vendorScripts', () => {
    return gulp.src(clientPaths.js.vendor)
        .pipe(plugins.concat('vendor.js'))
        .pipe(gulp.dest(`${clientPaths.dest}_js/vendor`));
});

// Images Task
gulp.task('imgmin', () => {
    return gulp.src(clientPaths.img)
        .pipe(plugins.cache(plugins.imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(`${clientPaths.dest}_img`));
});

// Fonts task
gulp.task('fonts', () => {
    return gulp.src(clientPaths.fonts)
        .pipe(gulp.dest(`${clientPaths.dest}fonts`));
});

// Icons task
gulp.task('icons', () => {
    return gulp.src(clientPaths.icons)
        .pipe(gulp.dest(`${clientPaths.dest}`));
});

gulp.task('templates', [], () => {
    return gulp.src(['client/partials/**/*.html', 'client/partials/**/**/*.html', 'client/partials/**/**/**/*.html', 'client/partials/**/**/**/**/*.html'])
        .pipe(plugins.ngTemplates({
            filename: 'templates.js',
            module: 'ngTemplates',
            path: (path, base) => {
                return `/partials/${path.replace(base, '')}`;
            }
        }))
        .pipe(gulp.dest('client/js/src/generated'));
});

gulp.task('languages', () => {
    return gulp.src('client/lang/generated/*.json')
        .pipe(plugins.jsonminify())
        .pipe(ngLang2Js({
            declareModule: true,
            moduleName: 'app.i18n',
            prefix: ''
        }))
        .pipe(plugins.concat('locale-en.js'))
        .pipe(gulp.dest('client/js/src/generated'));
});

gulp.task('merge-json', () => {
    return gulp.src('client/lang/en/**/*.json')
        .pipe(merge('en.json'))
        .pipe(gulp.dest('client/lang/generated'));
});

gulp.task('lint-json', () => {
    return gulp.src('client/lang/en/**/*.json')
        .pipe(plugins.jsonlint())
        .pipe(plugins.jsonlint.reporter())
        .pipe(plugins.jsonlint.failOnError());
});

// Scripts Task
gulp.task('scripts', [], () => {
    return gulp.src(clientPaths.js.src)
        .pipe(plugins.plumber({
            errorHandler: onError
        }))
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.concat('core.js'))
        .pipe(gulp.dest(`${clientPaths.dest}_js`))
        .pipe(plugins.uglify())
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(`${clientPaths.dest}_js`));
});

// Runs templates and scripts tasks
gulp.task('templateAndScripts', [], (cb) => {
    runSequence('templates', 'scripts', cb);
});

gulp.task('build-translation-cache', [], (cb) => {
    runSequence('lint-json', 'merge-json', 'languages', 'scripts', cb);
});

// Runs just tempates
gulp.task('getTemplates', [], () => {
    gulp.start('templates');
});

// Cleans out the destination directories
gulp.task('clean', () => {
    del([clientPaths.dest], {
        read: false
    });
});

// Manual Default task - does everything
gulp.task('default', ['clean'], (cb) => {
    runSequence('styles', 'getTemplates', ['scripts', 'vendorScripts'], 'imgmin', 'fonts', 'icons', cb);
});


gulp.task('watch', () => {
    gulp.watch('client/scss/**/*.scss', ['styles']);
    gulp.watch(['client/lang/en/*.json', 'client/lang/en/**/*.json'], ['build-translation-cache']);
    gulp.watch(['client/js/*.js', 'client/js/**/*.js', 'client/js/**/**/*.js', '!client/js/src/generated/*.js', '!client/js/src/widget/*.js'], ['scripts']);
    gulp.watch(['client/js/src/widget/*.js'], ['widget']);
    gulp.watch(['client/partials/**/*.html', 'client/partials/**/**/*.html', 'client/partials/**/**/**/*.html', 'client/partials/**/**/**/**/*.html'], ['templateAndScripts']);
});
