'use strict';

var staticFile = require('../lib/staticFile');
var Promise = require('bluebird');

var staticFiles = {
    js: [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/angular/angular.min.js',
        'bower_components/angular-route/angular-route.min.js',
        'bower_components/angular-resource/angular-resource.min.js',
        'bower_components/angular-resource/angular-resource.min.js',
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        'controlfrog/js/chart.js',

        'controlfrog/js/easypiechart.js',
        'controlfrog/js/excanvas.min.js',
        'controlfrog/js/gauge.js',
        'controlfrog/js/jquery.sparklines.js',
        'controlfrog/js/moment.js',
        'controlfrog/js/respond.min.js',
        'controlfrog/js/controlfrog-plugins.js',
        'controlfrog/js/controlfrog.js',

        'widgets/number.js'
    ],

    css: [
        'bower_components/bootstrap/dist/css/bootstrap.min.css',
        'controlfrog/css/controlfrog.css',
        'controlfrog/css/controlfrog.scss'
    ]
};

staticFiles.js = Promise.resolve(staticFiles.js).map(staticFile.url);
staticFiles.css = Promise.resolve(staticFiles.css).map(staticFile.url);

module.exports = function () {
    return function (req, res, next) {
        Promise.all([
            staticFiles.js,
            staticFiles.css
        ]).spread(function (js, css) {
            res.locals.styles = css;
            res.locals.scripts = js;
            next();
        }).catch(next).done();
    };
};
