/// <binding BeforeBuild='default' />
/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ts: {
            default: {
                src: ["Scripts/Ts/**/*.ts"],
                out: 'wwwroot/application.js'
            }
        },
        copy: {
            target: {
                files: [
                    { src: 'node_modules/webcomponents.js/webcomponents.min.js', dest: 'wwwroot/webcomponents.js' },
                    { expand: true, flatten: true, src: 'Scripts/Libraries/**', dest: 'wwwroot/', filter: 'isFile'},
                    { src: 'Templates/index.html', dest: 'wwwroot/index.html' }
                ]
            }
        },
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default', ['ts', 'copy']);
};
