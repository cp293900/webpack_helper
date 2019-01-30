// Karma configuration
// Generated on Tue Jan 29 2019 10:30:35 GMT+0800 (台北標準時間)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'fixture'],


    // list of files / patterns to load in the browser
    files: [
      'src/*.js',
      'test/*.js',
      'views/*.html'
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/*.js': [ 'webpack', 'coverage' ],
      'test/*.js': [ 'webpack' ],
      'views/*.html': ['html2js']
    },


    webpack: {
      mode: 'development',
      //devtool: 'inline-source-map',
      module: {
        rules: [
            { 
                loader: "babel-loader",
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
      }
    },
    
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress','coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    customLaunchers: {
      IE9: {
          base: 'IE',
          'x-ua-compatible': 'IE=EmulateIE9'
      },
      IE8: {
          base: 'IE',
          'x-ua-compatible': 'IE=EmulateIE8'
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
