const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('default', function() {
    return gulp.src('./test/test-server.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'nyan'}))
        .once('error', function(){
            process.exit(1);
        })
        .once('end', function(){
            process.exit();
        });
});