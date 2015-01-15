module.exports = function ( grunt ) {

  'use strict';

  /**
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  var _ = require('lodash');

  /**
   * Load in our build configuration file.
   */
  var userConfig = require( './build.config.js' );

  // debugger;

  function vendorDependencies (userConfig)
  {
      var dependencies = require('wiredep')({
                            exclude: [/webcomponentsjs/, /bootstrap\-sass/, /angular\-ui\-utils/]
                         });
      var ignorePath   = process.cwd() + '/';

      // console.log(dependencies);

      return [] // ['bower_components/platform/platform.js']  -- load polymer platform directly from cdn for now
                            .concat(_.map(dependencies.js, function (filepath) { return filepath.replace(ignorePath, ''); }))
                            .concat(userConfig.vendorFiles.js);
  }

  var vendorjs = vendorDependencies(userConfig);

  console.log(vendorjs);


  /**
   * This is the configuration object Grunt uses to give each plugin its
   * instructions.
   */
  var taskConfig = {
    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON('package.json'),


    /**
     * The banner is the comment that is placed at the top of our compiled
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner:
        '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
        ' */\n'
    },

    /**
     * Creates a changelog on a new version.
     */
    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        template: 'changelog.tpl'
      }
    },

    /**
     * Increments the version number, etc.
     */
    bump: {
      options: {
        files: [
          'package.json',
          'bower.json'
        ],
        commit: false,
        commitMessage: 'chore(release): v%VERSION%',
        commitFiles: [
          'package.json',
          'client/bower.json'
        ],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin'
      }
    },

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: [
      '<%= buildDir %>',
      '<%= distDir %>'
    ],


    wiredep: {
      options: {
        //cwd: '<%= yeoman.app %>'
      },
      app: {
        src: ['src/index.html'],
        ignorePath:  /\.\.\//
      },
      sass: {
        src: ['src/sass/main.scss'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },


    // grunt server settings
    connect: {
        options: {
            port       : 9001,
            hostname   : '0.0.0.0' // allow access to the server from outside.
            //livereload : 34729
        },
        livereload: {
            options: {
              open: true,
              middleware: function (connect) {
                return [
                  // connect.static('.tmp'),
                  // connect().use(
                  //   '/vendor',
                  //   connect.static('./vendor')
                  // ),
                  connect.static('build')
                ];
              }
            }
        }
        // ,
        // test: {
        //     options: {
        //       port: 9011,
        //       middleware: function (connect) {
        //         return [
        //           connect.static('.tmp'),
        //           connect.static('test'),
        //           connect().use(
        //             '/bower_components',
        //             connect.static('./bower_components')
        //           ),
        //           connect.static(appConfig.app)
        //         ];
        //       }
        //     }
        // },
        // dist: {
        //   options: {
        //     open: true,
        //     base: '<%= yeoman.dist %>'
        //   }
        // }
    },

    /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts, etc.) and javascripts into
     * `buildDir`, and then to copy the assets to `distDir`.
     */
    copy: {
      build_app_assets: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= buildDir %>/assets/',
            cwd: 'src/assets',
            expand: true
          }
       ]
      },
      build_vendor_assets: {
        files: [
          {
            src: [ '<%= vendorFiles.assets %>' ],
            dest: '<%= buildDir %>/assets/',
            cwd: '.',
            expand: true,
            flatten: false
          }
       ]
      },
      build_appjs: {
        files: [
          {
            src: [ '<%= appFiles.js %>' ],
            dest: '<%= buildDir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_vendorjs: {
        files: [
          {
            src: vendorjs,
            dest: '<%= buildDir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_vendorcss: {
        files: [
          {
            src: [ '<%= vendorFiles.css %>' ],
            dest: '<%= buildDir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      compile_assets: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= distDir %>/assets',
            cwd: '<%= buildDir %>/assets',
            expand: true
          },
          {
            src: [ '<%= vendorFiles.css %>' ],
            dest: '<%= compileDir %>/',
            cwd: '.',
            expand: true
          }
        ]
      }
    },

    /**
     * `grunt concat` concatenates multiple source files into a single file.
     */
    concat: {
      /**
       * The `build_css` target concatenates compiled CSS and vendor CSS
       * together.
       */
      build_css: {
        src: [
          '<%= vendorFiles.css %>',
          '<%= compass.dev.options.cssDir %>/main.css'
        ],
        dest: '<%= buildDir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
      },
      build_dist_css: {
        src: [
          '<%= vendorFiles.css %>',
          '<%= compass.dist.options.cssDir %>/main.css'
        ],
        dest: '<%= buildDir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
      },
      /**
       * The `compile_js` target is the concatenation of our application source
       * code and all specified vendor source code into a single file.
       */
      compile_js: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: vendorjs.concat([
          'module.prefix',
          '<%= buildDir %>/src/**/*.js',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          'module.suffix'
        ]),
        dest: '<%= distDir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

    /**
     * `grunt coffee` compiles the CoffeeScript sources. To work well with the
     * rest of the build, we have a separate compilation task for sources and
     * specs so they can go to different places. For example, we need the
     * sources to live with the rest of the copied JavaScript so we can include
     * it in the final build, but we don't want to include our specs there.
     */
    coffee: {
      source: {
        options: {
          bare: true
        },
        expand: true,
        cwd: '.',
        src: [ '<%= appFiles.coffee %>' ],
        dest: '<%= buildDir %>',
        ext: '.js'
      }
    },

    /**
     * `ng-annotate` annotates the sources before minifying. That is, it allows us
     * to code without the array syntax.
     */
    ngAnnotate: {
      compile: {
        files: [
          {
            src: [ '<%= appFiles.js %>' ],
            cwd: '<%= buildDir %>',
            dest: '<%= buildDir %>',
            expand: true
          }
        ]
      }
    },

    /**
     * Minify the sources!
     */
    uglify: {
      compile: {
        options: {
          banner    : '<%= meta.banner %>',
          sourceMap : true // '<%= distDir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js.map'
        },
        files: {
          '<%= distDir %>/assets/<%= pkg.name %>-<%= pkg.version %>.min.js': '<%= concat.compile_js.dest %>'
        }
      }
    },

    // /**
    //  * `grunt-contrib-less` handles our LESS compilation and uglification automatically.
    //  * Only our `main.less` file is included in compilation; all other files
    //  * must be imported from this file.
    //  */
    // less: {
    //   build: {
    //     files: {
    //       '<%= buildDir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= appFiles.less %>'
    //     }
    //   },
    //   compile: {
    //     files: {
    //       '<%= buildDir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= appFiles.less %>'
    //     },
    //     options: {
    //       cleancss: true,
    //       compress: true
    //     }
    //   }
    // },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        //browsers: ['last 2 versions'],
        diff: true
      },
      dist: {
        files: [{
          expand : true,
          cwd    : '<%= buildDir %>/.dist/.tmp/',
          src    : '{,*/}*.css',
          dest   : '<%= buildDir %>/.dist/.tmp/'
        }]
      },

      dev: {
        files: [{
          expand : true,
          cwd    : '<%= buildDir %>/.tmp/',
          src    : '{,*/}*.css',
          dest   : '<%= buildDir %>/.tmp/'
        }]
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {

      options: {
          sassDir: '<%= appFiles.sass %>',
          importPath: ['<%= vendorFiles.dir %>', '<%= appFiles.sasspartials %>'],
          raw: ['preferred_syntax = :scss',
                'Sass::Script::Number.precision = 10',
                'line_comments = false',
                ''].join('\n')
      },

      dist: {
        options: {
          environment : 'production',
          outputStyle : 'compact',
          cssDir      : '<%= buildDir %>/.dist/.tmp/',
          cacheDir    : '<%= buildDir %>/.dist/.sass_cache'
        }
      },

      dev: {
        options: {
          environment : 'development',
          outputStyle : 'expanded',
          cssDir      : '<%= buildDir %>/.tmp/',
          cacheDir    : '<%= buildDir %>/.sass_cache',
          debugInfo   : true
        }
      }
    },
    // compass: {
    //   options: {
    //     cssDir: '.tmp/styles',
    //     generatedImagesDir: '.tmp/images/generated',
    //     imagesDir: '<%= yeoman.app %>/images',
    //     javascriptsDir: '<%= yeoman.app %>',
    //     fontsDir: '<%= yeoman.app %>/styles/fonts',
    //     importPath: './bower_components',
    //     httpImagesPath: '/images',
    //     httpGeneratedImagesPath: '/images/generated',
    //     httpFontsPath: '/styles/fonts',
    //     relativeAssets: false,
    //     assetCacheBuster: false,
    //     raw: 'Sass::Script::Number.precision = 10\n'
    //   },
    //   dist: {
    //     options: {
    //       generatedImagesDir: '<%= yeoman.dist %>/images/generated'
    //     }
    //   },
    //   server: {
    //     options: {
    //       debugInfo: true
    //     }
    //   }
    // },

    /**
     * `jshint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in `options`. But we can also
     * specify exclusionary patterns by prefixing them with an exclamation
     * point (!); this is useful when code comes from a third party but is
     * nonetheless inside `src/`.
     */
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      src: [
        '<%= appFiles.js %>'
      ],
      test: {
        options: {
          jshintrc: 'karma/.jshintrc'
        },
        src: ['<%= appFiles.jsunit %>']
      },
      gruntfile: {
        options: {
          jshintrc: 'karma/.jshintrc' // reusing the test jshint settings for Gruntfile
        },
        src: ['Gruntfile.js']
      },
      // options: {
      //   curly: true,
      //   immed: true,
      //   newcap: true,
      //   noarg: true,
      //   sub: true,
      //   boss: true,
      //   eqnull: true
      // },
      globals: {}
    },

    /**
     * `coffeelint` does the same as `jshint`, but for CoffeeScript.
     * CoffeeScript is not the default in ngBoilerplate, so we're just using
     * the defaults here.
     */
    coffeelint: {
      src: {
        files: {
          src: [ '<%= appFiles.coffee %>' ]
        }
      },
      test: {
        files: {
          src: [ '<%= appFiles.coffeeunit %>' ]
        }
      }
    },

    /**
     * HTML2JS is a Grunt plugin that takes all of your template files and
     * places them into JavaScript files as strings that are added to
     * AngularJS's template cache. This means that the templates too become
     * part of the initial payload as one JavaScript file. Neat!
     */
    html2js: {
      /**
       * These are the templates from `src/app`.
       */
      app: {
        options: {
          base: 'src/app'
        },
        src: [ '<%= appFiles.atpl %>' ],
        dest: '<%= buildDir %>/templates-app.js'
      },

      /**
       * These are the templates from `src/common`.
       */
      common: {
        options: {
          base: 'src/common'
        },
        src: [ '<%= appFiles.ctpl %>' ],
        dest: '<%= buildDir %>/templates-common.js'
      }
    },

    /**
     * The Karma configurations.
     */
    karma: {
      options: {
        configFile: '<%= buildDir %>/karma-unit.js'
      },
      unit: {
        port       : 9019,
        background : true,
        singleRun  : false,
        logLevel   : 'debug'
      },
      continuous: {
        singleRun : true
      }
    },

    /**
     * The `index` task compiles the `index.html` file as a Grunt template. CSS
     * and JS files co-exist here but they get split apart later.
     */
    index: {

      /**
       * During development, we don't want to have wait for compilation,
       * concatenation, minification, etc. So to avoid these steps, we simply
       * add all script files directly to the `<head>` of `index.html`. The
       * `src` property contains the list of included files.
       */
      build: {
        dir: '<%= buildDir %>',
        src: vendorjs.concat([
          '<%= buildDir %>/src/**/*.js',
          '<%= html2js.common.dest %>',
          '<%= html2js.app.dest %>',
          '<%= vendorFiles.css %>',
          '<%= buildDir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
          // '<%= buildDir %>/assets/*.css'
        ]),
        lr: [ 'http://localhost:35729/livereload.js' ]
      },

      /**
       * When it is time to have a completely compiled application, we can
       * alter the above to include only a single JavaScript and a single CSS
       * file. Now we're back!
       */
      compile: {
        dir: '<%= distDir %>',
        src: [
          '<%= distDir %>/assets/<%= pkg.name %>-<%= pkg.version %>.min.js',
          '<%= vendorFiles.css %>',
          '<%= buildDir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ],
        lr: []  // we don't want to include livereload on compile
      }
    },

    /**
     * This task compiles the karma template so that changes to its file array
     * don't have to be managed manually.
     */
    karmaconfig: {
      unit: {
        dir: '<%= buildDir %>',
        src: vendorjs.concat([
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          '<%= testFiles.js %>'
        ])
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don't need the same thing to happen for all the files.
     */
    delta: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true
      },

      /**
       * When the Gruntfile changes, we just want to lint it. In fact, when
       * your Gruntfile changes, it will automatically be reloaded!
       */
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: [ 'jshint:gruntfile' ],
        options: {
          livereload: false
        }
      },

      /**
       * When our JavaScript source files change, we want to run lint them and
       * run our unit tests.
       */
      jssrc: {
        files: [
          '<%= appFiles.js %>'
        ],
        tasks: [ 'jshint:src', 'karma:unit:run', 'copy:build_appjs' ]
      },

      /**
       * When our CoffeeScript source files change, we want to run lint them and
       * run our unit tests.
       */
      coffeesrc: {
        files: [
          '<%= appFiles.coffee %>'
        ],
        tasks: [ 'coffeelint:src', 'coffee:source', 'karma:unit:run', 'copy:build_appjs' ]
      },

      /**
       * When assets are changed, copy them. Note that this will *not* copy new
       * files, so this is probably not very useful.
       */
      assets: {
        files: [
          'src/assets/**/*'
        ],
        tasks: [ 'copy:build_app_assets', 'copy:build_vendor_assets' ]
      },

      /**
       * When index.html changes, we need to compile it.
       */
      html: {
        files: [ '<%= appFiles.html %>' ],
        tasks: [ 'index:build' ]
      },

      /**
       * When our templates change, we only rewrite the template cache.
       */
      tpls: {
        files: [
          '<%= appFiles.atpl %>',
          '<%= appFiles.ctpl %>'
        ],
        tasks: [ 'html2js' ]
      },

      // /**
      //  * When the CSS files change, we need to compile and minify them.
      //  */
      // less: {
      //   files: [ 'src/**/*.less' ],
      //   tasks: [ 'less:build' ]
      // },

      /**
       * When the CSS files change, we need to compile and minify them.
       */
      compass: {
        files: [ '<%= appFiles.sass %>/*.scss', '<%= appFiles.sasspartials %>/**/*.scss' ],
        tasks: [ 'compass:dev', 'autoprefixer:dev', 'concat:build_css' ]
      },

      /**
       * When a JavaScript unit test file changes, we only want to lint it and
       * run the unit tests. We don't want to do any live reloading.
       */
      jsunit: {
        files: [
          '<%= appFiles.jsunit %>'
        ],
        tasks: [ 'jshint:test', 'karma:unit:run' ],
        options: {
          livereload: false
        }
      },

      /**
       * When a CoffeeScript unit test file changes, we only want to lint it and
       * run the unit tests. We don't want to do any live reloading.
       */
      coffeeunit: {
        files: [
          '<%= appFiles.coffeeunit %>'
        ],
        tasks: [ 'coffeelint:test', 'karma:unit:run' ],
        options: {
          livereload: false
        }
      }
    },

    apimock: {
      options: {
        port: 3000,
        src: '<%= appFiles.apidoc %>'
      }
    }
  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask( 'watch', 'delta' );
  grunt.registerTask( 'watch', [ 'build', 'connect:livereload', 'karma:unit', 'apimock', 'delta' ] );

  /**
   * The default task is to build and compile.
   */
  grunt.registerTask( 'default', [ 'build', 'compile' ] );

  /**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask( 'build', [
    'clean', 'html2js', 'jshint',
    //'coffeelint', 'coffee',
    'compass:dev', 'autoprefixer:dev', //'less:build',
    'concat:build_css',
    'copy:build_app_assets', 'copy:build_vendor_assets',
    'copy:build_appjs', 'copy:build_vendorjs', 'copy:build_vendorcss',
    'index:build',
    'karmaconfig', 'karma:continuous'
  ]);

  /**
   * The `compile` task gets your app ready for deployment by concatenating and
   * minifying your code.
   */
  grunt.registerTask( 'compile', [
    'compass:dist', 'autoprefixer:dist',
    'concat:build_dist_css', 'copy:compile_assets',
    'ngAnnotate', 'concat:compile_js', 'uglify', 'index:compile'
  ]);


  /**
   * A utility function to get all app JavaScript sources.
   */
  function filterForJS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.js$/ );
    });
  }

  /**
   * A utility function to get all app CSS sources.
   */
  function filterForCSS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.css$/ );
    });
  }

  /**
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask( 'index', 'Process index.html template', function () {
    var dirRE = new RegExp( '^('+grunt.config('buildDir')+'|'+grunt.config('distDir')+')\/', 'g' );
    var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });
    var cssFiles = filterForCSS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });
    var lrFile = this.data.lr; // get the livereload file if it exists for this task

    grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
      process: function ( contents /*, path*/ ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            lr: lrFile, // pass the livereload file
            version: grunt.config( 'pkg.version' )
          }
        });
      }
    });
  });

  /**
   * In order to avoid having to specify manually the files needed for karma to
   * run, we use grunt to manage the list for us. The `karma/*` files are
   * compiled as grunt templates for use by Karma. Yay!
   */
  grunt.registerMultiTask( 'karmaconfig', 'Process karma config templates', function () {
    var jsFiles = filterForJS( this.filesSrc );

    grunt.file.copy( 'karma/karma-unit.tpl.js', grunt.config( 'buildDir' ) + '/karma-unit.js', {
      process: function ( contents /*, path*/ ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles
          }
        });
      }
    });
  });

};
