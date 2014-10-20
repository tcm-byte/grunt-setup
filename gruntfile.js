module.exports = function(grunt) {
    'use strict';

    var modRewrite = require('connect-modrewrite');

    grunt.initConfig({

        githooks: {
            all: {
                // Will run the jshint and test:unit tasks at every commit
                'pre-commit': 'concurrent:linting',
                'post-merge': 'npm-install githooks'
            }
        },


        connect: {
            server: {
                options: {
                    port: 9001,
                    base: 'dist',
                    keepalive: true,
                    middleware: function (connect, options, middlewares) {
                        middlewares.unshift(function (req, res, next) {
                            res.setHeader('Access-Control-Allow-Origin', '*');
                            res.setHeader('Access-Control-Allow-Methods', '*');
                            return next();
                        });

                        middlewares.push(modRewrite(['^[^\\.]*$ /index.html [L]'])); //Matches everything that does not contain a '.' (period)
                        options.base.forEach(function(base) {
                            middlewares.push(connect.static(base));
                        });

                        middlewares.push(require('connect-livereload')());
                        return middlewares;
                    }
                }
            }
        },

        htmlhint: {
            all: {
                options: {
                    'tag-pair': true,
                    'tagname-lowercase': true,
                    'attr-lowercase' : true,
                    'id-unique' : true,
                    'style-disabled': true

                },
                src: ['src/partials/**/*.phtml', "dist/pages/**/*.html"]
            }
        },

        concurrent: {
            linting: ['search:inlinestyles', 'jshint', 'scsslint', 'htmlhint']
        },

        search: {
            inlinestyles: {
                files: {
                    src: ["src/**/*.html", "src/**/*.phtml", "dist/pages/**/*.html"]
                },
                options: {
                    searchString: / style\s?=\s?["']*/g,
                    failOnMatch: false,
                    logFile: "inlinestyles.json",
                    onMatch: function(params){
                        var msg = 'Inline Styles Detected in: '.red + (params.file).blue + (" at line: " + params.line).red;
                        console.log(msg);
                    },
                    onComplete: function(params){
                        if(params.numMatches > 0)
                            grunt.fail.fatal("Inline styles were detected in " + params.numMatches + " file(s).");
                    }
                }
            }
        },

        html2js: {
            options: {
                module: "template-precache",
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeComments: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                }

            },
            main: {
                src: ['src/partials/**/{**/*,*}.phtml'],
                dest: 'src/assets/js/core/template-cache.js'
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            dev: {
                src: ['src/assets/js/lib/jquery-1.11.1.min.js','src/assets/js/lib/angular.unmin.js','src/assets/js/core.js'],
                dest: 'src/assets/js/core.js'
            },
            live: {
                src: ['src/assets/js/lib/jquery-1.11.1.min.js','src/assets/js/lib/angular.min.js','src/assets/js/core.js'],
                dest: 'src/assets/js/core.js'
            }
        },

        compass: {
            dev: {
                options: {
                    sassDir: 'src/assets/scss',
                    cssDir: 'src/assets/css',
                    imagesDir: 'src/assets/img',
                    fontsDir: 'src/assets/fonts',
                    environment: 'development',
                    sourcemap: false,
                    relativeAssets: true
                }
            },
            live: {
                options: {
                    sassDir: 'src/assets/scss',
                    cssDir: 'src/assets/css',
                    imagesDir: 'src/assets/img',
                    fontsDir: 'src/assets/fonts',
                    environment: 'production',
                    sourcemap: false,
                    relativeAssets: true,
                    force: true
                }
            }
        },

        copy: {
            css: { files: [{expand: true, flatten: true, src: ['src/assets/css/*'], dest: 'dist/' + grunt.file.readJSON('package.json').version + '/css'}] },
            js:  { cwd: 'src/assets/js/', src: 'core.js', dest: 'dist/' + grunt.file.readJSON('package.json').version + '/js/', expand: true },
            img: { cwd: 'src/assets/img/', src: '{*,**/*}', dest: 'dist/' + grunt.file.readJSON('package.json').version + '/img/', expand: true },
            fonts: { cwd: 'src/assets/fonts/', src: '{*,**/*}', dest: 'dist/' + grunt.file.readJSON('package.json').version + '/fonts/', expand: true },
        },

        jshint: {
            options: { jshintrc: '.jshintrc' },
            all: ['src/assets/js/core/{*,**/*}.js']
        },

        clean: {
            dist: ["dist/gzip","dist/"+grunt.file.readJSON('package.json').version,".sass-cache"],
            js: ['dist/' + grunt.file.readJSON('package.json').version + '/js/core', 'dist/' + grunt.file.readJSON('package.json').version + '/js/lib']
        },

        uglify: {
            js: {
                options: {
                    mangle: false,
                    beautify: false,
                    compress: false
                },
                files: {
                    'src/assets/js/core.js' : [
                        'src/assets/js/lib/{*,**/*}.js',
                        'src/assets/js/core/{*,**/*}.js',
                        '!src/assets/js/lib/angular-mocks.js',
                        '!src/assets/js/lib/angular.min.js',
                        '!src/assets/js/lib/angular.unmin.js',
                        '!src/assets/js/lib/jquery-1.11.1.min.js'
                    ]
                }
            },
            jsDeploy: {
                options: {
                    mangle: false,
                    beautify: false,
                    compress: {
                        drop_console: true,
                        dead_code: true
                    },
                    sourceMap: false
                },
                files: {
                    'src/assets/js/core.js' : [
                        'src/assets/js/lib/{*,**/*}.js',
                        'src/assets/js/core/{*,**/*}.js',
                        '!src/assets/js/lib/angular-mocks.js',
                        '!src/assets/js/lib/angular.min.js',
                        '!src/assets/js/lib/angular.unmin.js',
                        '!src/assets/js/lib/jquery-1.11.1.min.js'
                    ]
                }
            },
            whitespace: {
                options: {
                    mangle: false,
                    beautify: false,
                    compress: false
                },
                files: {
                    'src/assets/js/core.js' : [ 'src/assets/js/core.js' ]
                }
            }
        },

        watch: {
            sass: {
                files: ['src/assets/scss/{*,**/*}.scss'],
                tasks: ['css']
            },
            scripts: {
                files: ['src/assets/js/core/{*,**/*}.js','src/assets/js/lib/{*,**/*}.js','!src/assets/js/core/template-cache.js'],
                tasks: ['js']
            },
            partials: {
                files: ['src/partials/{*,**/*}.phtml'],
                tasks: ['js']
            },
            liveReload: {
                files: ['dist/{*,**/*}'],
                options: {
                    livereload: true
                }
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },

        scsslint: {
            allFiles: [ 'src/assets/scss/{*,**/*}.scss' ],
            options: {
                config: '.scss-lint.yml',
                colorizeOutput: true,
                reporterOutput: null
            }
        }

    });

    // Load tasks
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('css', ['compass:dev','copy:css']);
    grunt.registerTask('js', ['html', 'jshint','uglify:js','concat:dev','copy:js' ]);
    grunt.registerTask('html', ['search:inlinestyles','htmlhint','html2js']);
    grunt.registerTask('fonts', ['copy:fonts']);
    grunt.registerTask('img', ['copy:img']);
    grunt.registerTask('test', ['karma']);
    grunt.registerTask('default',['clean:dist','css','js','img','fonts','copy']);
    grunt.registerTask('build',['clean:dist','scsslint','compass:live','search:inlinestyles','htmlhint','html2js','jshint','uglify:jsDeploy','concat:live','uglify:whitespace','copy','clean:js','fonts','karma']);

    grunt.registerTask('serve',['connect']);
};