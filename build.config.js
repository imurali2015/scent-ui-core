/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
   * The `buildDir` folder is where our projects are compiled during
   * development and the `distDir` folder is where our app resides once it's
   * completely built.
   */
  buildDir : 'build',
  distDir  : 'dist',

  /**
   * This is a collection of file patterns that refer to our app code (the
   * stuff in `src/`). These file paths are used in the configuration of
   * build tasks. `js` is all project javascript, less tests. `ctpl` contains
   * our reusable components' (`src/common`) template HTML files, while
   * `atpl` contains the same, but for our app's code. `html` is just our
   * main HTML file, `less` is our main stylesheet, and `unit` contains our
   * app's unit tests.
   */
  appFiles: {
    js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
    jsunit: [ 'src/**/*.spec.js' ],

    coffee: [ 'src/**/*.coffee', '!src/**/*.spec.coffee' ],
    coffeeunit: [ 'src/**/*.spec.coffee' ],

    atpl: [ 'src/app/**/*.tpl.html' ],
    ctpl: [ 'src/common/**/*.tpl.html' ],

    html: [ 'src/index.html' ],

    sass         : 'src/sass',
    sasspartials : 'src/app',
    // less: 'src/less/main.less'

    apidoc: 'doc/scent.apib'
  },

  /**
   * This is a collection of files used during testing only.
   */
  testFiles: {
    js: [
      'bower_components/angular-mocks/angular-mocks.js'
    ]
  },

  /**
   * This is the same as `appFiles`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `appFiles` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendorFiles.js`.
   *
   * The `vendorFiles.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendorFiles.css` property holds any CSS files to be automatically
   * included in our app.
   *
   * The `vendorFiles.assets` property holds any assets to be copied along
   * with our app's assets. This structure is flattened, so it is not
   * recommended that you use wildcards.
   */
  vendorFiles: {

    dir: 'bower_components',

    js: [
      // 'bower_components/angular/angular.js',
      // 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      // 'bower_components/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js',
      // 'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-ui-utils/modules/route/route.js'
      // 'bower_components/platform/platform.js.map',
      // 'bower_components/polymer/polymer.js.map'

    ],
    css: [
    ],
    assets: [
      'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*.*'
    ]
  }
};
