var gulp = require("gulp");

// gulp plugins
var sass = require("gulp-sass"),
    livereload = require('gulp-livereload');

gulp.task('sass', function(){
  return gulp.src('public/sass/main.scss')
        .pipe(sass({outputStyle: 'commpressed'}))
        .pipe(gulp.dest('public/css'))
        .pipe(livereload());
});

gulp.task('reload', function(){
  return gulp.src('/')
        .pipe(livereload());
});

gulp.task("watch", function() {
  livereload.listen();
  gulp.watch('public/**/*.scss', ['sass']); 
  gulp.watch(['server/views/*.jade', 'public/js/*.js'], ['reload']); 
});

gulp.task('default', ['sass', 'watch']);