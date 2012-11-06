/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-requirejs');

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
      baseUrl: "src",
      paths: {
          main: "main"
      },
      include: ["main"],
      exclude: [],
      out: "dist/build.js",
      wrap: {
          startFile: "wrap/wrap.start",
          endFile: "wrap/wrap.end"
      },
      findNestedDependencies: true
    },
    lint: {
      files: [
        'grunt.js',
        'src/*.js',
        'src/*/*.js',
        'src/*/*/*.js',
        'src/*/*/*/*.js'
     ]
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:requirejs.out>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint'
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
        "sb": true,
        "ko": true,
        "define": true 
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint requirejs min');

};
