/*global module:false*/
module.exports = function(grunt) {

        grunt.loadNpmTasks('grunt-requirejs');
        grunt.loadNpmTasks('grunt-contrib-yuidoc');
        grunt.loadNpmTasks('grunt-shell');

        // Project configuration.
        grunt.initConfig({
                pkg: '<json:package.json>',
                meta: {
                        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                                '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
                                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                                ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
                },
                requirejs: {
                        baseUrl: ".",
                        paths: {
                                "almond":"lib/almond",
                                "sb":"src/sb"
                        },
                        include: [
                                "almond",
                                "sb/main"
                        ],
                        exclude: [],
                        out: "dist/build.js",
                        wrap: {
                                startFile: "wrap/wrap.start",
                                endFile: "wrap/wrap.end"
                        },
                        skipModuleInsertion: false,
                        optimizeAllPluginResources: true,
                        findNestedDependencies: true
                },
                lint: {
                        files: [
                                'src/sb/*.js',
                                'src/sb/util/*.js',
                                'src/sb/base/*.js',
                                'src/sb/base/binding/*.js',
                                'src/sb/base/observable/*.js',
                                'src/sb/base/observable/ko/*.js',
                                'src/sb/base/factory/*.js',

                                'test/sepc/*.js'
                        ]
                },
                min: {
                       dist: {
                                src: ['<banner:meta.banner>','<config:requirejs.out>'],
                                dest: 'dist/<%= pkg.name %>.min.js'
                        }
                },
                shell: {
                        test: {
                                command: 'mocha-phantomjs -R spec test/*.html',
                                stdout: true
                        }
                },
                watch: {
                        files: '<config:lint.files>',
                        tasks: 'default'
                },
                jshint: {
                        options: {
                                curly: true,
                                eqeqeq: true,
                                immed: true,
                                latedef: true,
                                newcap: true,
                                noarg: true,
                                sub: true,
                                undef: true,
                                boss: true,
                                eqnull: true,
                                browser: true
                        },
                        globals: {
                                "console":true,
                                "sb": true,
                                "ko": true,
                                "define": true
                        }
                },
                yuidoc: {
                        compile: {
                                "name": '<%= pkg.title || pkg.name %>',
                                "description": '<%= pkg.description %>',
                                "version": '<%= pkg.version %>',
                                "logo": '../img/logo.png',
                                "url": '<%= pkg.homepage %>',
                                options: {
                                        paths: '<config:requirejs.baseUrl>',
                                        outdir: 'docs',
                                        blockHelper: true
                                }
                        }
                }
        });

        // Create API documnet
        grunt.registerTask('doc', 'yuidoc');

        // Test with mocha-phantomjs
        grunt.registerTask('test', 'shell:test');
        // Default task.
        grunt.registerTask('default', 'lint requirejs min test doc');

};
