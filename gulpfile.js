const gulp = require('gulp');
const mocha = require('gulp-mocha');
const plumber      = require('gulp-plumber');
const clean        = require('gulp-clean');
const autoprefixer = require('gulp-autoprefixer');
const concat       = require('gulp-concat');
const replace      = require('gulp-replace');
const rename       = require('gulp-rename');
const react        = require('gulp-react');
const babel        = require('gulp-babel');
const browserify   = require('gulp-browserify');
const minifycss    = require('gulp-clean-css');
const uglify       = require('gulp-uglify');
const stripDebug   = require('gulp-strip-debug');
const _            = require('lodash');

/***************** CONFIGURATION *****************/
var
  $version = '0.0.1',
  $src = 'client/source',
  $srcTestServer = './test/test-server.js',
  $dst = {
    debug: {
      cfg:    '/config.debug.js',
      dst:    'client/build',
      locale: 'en-US',
      minify: false
    },
    commercial: {
      cfg:    '/config.commercial.js',
      dst:    'client/build',
      locale: 'en-US',
      minify: true
    }
  }
  ;
var $path = {
  babelrc: $src + '/.babelrc',
  css     : [
    $src + '/css/*.css'
  ],
  img     : $src + '/img/**/*',
  html    : $src + '/index.html',
  js      : [
    $src + '/**/*.js',
    $src + '/**/*.jsx',
    '!' + $src + '/config.*.js'
  ],
  removeFiles: [
    '/**/*.js',
    '/**/*.jsx'
  ]
};

/***************** TASK RUN *****************/
var tasks = {
  clean: function( $target ) {
    return gulp.src( $target.dst, {read: false} )
      .pipe(plumber())
      .pipe(clean())
      ;
  },

  makeCss: function( $target ) {
    return gulp.src( $target.css )
      .pipe(plumber())
      .pipe(autoprefixer())
      .pipe(concat('index.css'))
      .pipe(rename({basename: 'index-'+$version}))
      .pipe(gulp.dest( $target.dst+'/css/' ))
      ;
  },

  copyImage: function( $target ) {
    return gulp.src( $target.img )
      .pipe(plumber())
      .pipe(gulp.dest( $target.dst + '/img' ))
      ;
  },

  copyHtml: function( $target ) {
    return gulp.src( $target.html )
      .pipe(plumber())
      .pipe(gulp.dest( $target.dst ))
      ;
  },

  copyScript: function( $target ) {
    return gulp.src( $target.js )
      .pipe(plumber())
      .pipe(gulp.dest( $target.dst ))
      ;
  },

  copyHtaccess: function( $target ) {
    return gulp.src( $target.babelrc )
      .pipe(plumber())
      .pipe(gulp.dest( $target.dst ))
      ;
  },

  makeConfig: function( $target ) {
    return gulp.src( $src + $target.cfg )
      .pipe(plumber())
      .pipe(replace('{{{gulp-version}}}', $version))
      .pipe(replace('{{{gulp-default-locale}}}', $target.locale))
      .pipe(rename({basename: 'config'}))
      .pipe(gulp.dest( $target.dst + '/js' ))
      ;
  },

  makeVersion: function( $target ) {
    return gulp.src($target.dst + '/index.html')
      .pipe(plumber())
      .pipe(replace('{{{gulp-version}}}', $version))
      .pipe(gulp.dest( $target.dst ))
      ;
  },

  react: function( $target ) {
    return gulp.src( $target.dst + '/js/*.jsx' )
      .pipe(plumber())
      .pipe(react({harmony: false, es6module: true}))
      .pipe(gulp.dest( $target.dst + '/js' ))
      ;
  },

  babel: function( $target ) {
    return gulp.src( $target.dst + '/js/*.js' )
      .pipe(plumber())
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(gulp.dest( $target.dst + '/js' ))
      ;
  },

  browserify: function( $target ) {
    return gulp.src( $target.dst + '/js/index.js' )
      .pipe(plumber())
      .pipe(browserify())
      .pipe(rename({basename: 'index-'+$version}))
      .pipe(gulp.dest( $target.dst + '/js' ))
      ;
  },

  removeFiles: function( $target ) {
    var removes = [];
    for(var i=0,l=$target.removeFiles.length; i<l; i++) {
      removes.push( $target.dst + $target.removeFiles[i] );
    }

    removes.push( '!' + $target.dst + '/js/index-'+$version+'.js' );

    return gulp.src( removes, {read: false} )
      .pipe(plumber())
      .pipe(clean())
      ;
  },

  minifyCss: function( $target ) {
    return gulp.src( $target.dst + '/css/index-'+$version+'.css' )
      .pipe(plumber())
      .pipe(minifycss())
      .pipe(gulp.dest( $target.dst + '/css/' ))
      ;
  },

  minifyJs: function( $target ) {
    return gulp.src( $target.dst + '/js/index-'+$version+'.js' )
      .pipe(plumber())
      .pipe(uglify())
      .pipe(gulp.dest( $target.dst + '/js/' ))
      ;
  },

  stripDebug: function( $target ) {
    return gulp.src( $target.dst + '/js/index-'+$version+'.js' )
      .pipe(plumber())
      .pipe(stripDebug())
      .pipe(gulp.dest( $target.dst + '/js/' ))
      ;
  },
  unitTestServer: function(){
    return gulp.src( $srcTestServer, {read: false})
      .pipe(mocha({reporter: 'nyan'}))
      .once('error', function(){
        process.exit(1);
      })
      .once('end', function(){
        process.exit();
      });
  }
}

/***************** TASK DEFINATION *****************/
_.forEach($dst, function(config, name){
  var target = _.assignIn( $dst[name], $path );
  gulp.task('clean-' + name, function(){
    return tasks.clean(target);
  });
  gulp.task('make-css-' + name, ['clean-' + name], function(){
    return tasks.makeCss(target);
  });
  gulp.task('copy-image-' + name, ['clean-' + name], function(){
    return tasks.copyImage(target);
  });
  gulp.task('copy-html-' + name, ['clean-' + name], function(){
    return tasks.copyHtml(target);
  });
  gulp.task('copy-script-' + name, ['clean-' + name], function(){
    return tasks.copyScript(target);
  });
  gulp.task('copy-htaccess-' + name, ['clean-' + name], function(){
    return tasks.copyHtaccess(target);
  });
  gulp.task('make-config-' + name, ['copy-script-' + name], function(){
    return tasks.makeConfig(target);
  });
  gulp.task('make-version-' + name, ['copy-html-' + name, 'copy-script-' + name], function(){
    return tasks.makeVersion(target);
  });
  gulp.task('react-' + name, ['make-version-' + name], function(){
    return tasks.react(target);
  });
  gulp.task('babel-' + name, ['react-' + name], function(){
    return tasks.babel(target);
  });
  gulp.task('browserify-' + name, ['babel-' + name], function(){
    return tasks.browserify(target);
  });
  gulp.task('clean-tmp-' + name, ['browserify-' + name], function(){
    return tasks.removeFiles(target);
  });

  if(target.minify) {
    gulp.task('minify-css-' + name, ['make-css-' + name], function(){
      return tasks.minifyCss(target);
    });
    gulp.task('minify-js-' + name, ['browserify-' + name], function(){
      return tasks.minifyJs(target);
    });
    gulp.task('strip-debug-' + name, ['minify-js-' + name], function(){
      return tasks.stripDebug(target);
    });
    gulp.task('unit-test-server-' + name, ['strip-debug-' + name], function(){
      return tasks.unitTestServer();
    });
  }else{
    gulp.task('unit-test-server-' + name, ['clean-tmp-' + name], function(){
      return tasks.unitTestServer();
    });
  }
});

var MODES = {};
for( var name in $dst ) {
  if(typeof MODES[name] == 'undefined')
    MODES[name] = [];

  MODES[name].push('clean-' + name);

  MODES[name].push('make-css-' + name);

  MODES[name].push('copy-image-' + name);

  MODES[name].push('copy-html-' + name);

  MODES[name].push('copy-script-' + name);

  MODES[name].push('copy-htaccess-' + name);

  MODES[name].push('make-config-' + name);

  MODES[name].push('make-version-' + name);

  MODES[name].push('react-' + name);

  MODES[name].push('babel-' + name);

  MODES[name].push('browserify-' + name);

  MODES[name].push('clean-tmp-' + name);

  if($dst[name].minify) {
    MODES[name].push('minify-css-' + name);

    MODES[name].push('minify-js-' + name);

    MODES[name].push('strip-debug-' + name);
  }
  MODES[name].push('unit-test-server-'+name);
}

for(var name in MODES) {
  gulp.task('build-' + name, MODES[name]);
  gulp.task(name, MODES[name]);
}
gulp.task('default', MODES['debug']);