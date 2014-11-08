'use strict';

var staticFile = require('../lib/staticFile');
var bluebird = require('bluebird');

var staticFiles = {
    js: [
        'bower_components/jquery/dist/jquery.js',
        'bower_components/jquery-ui/jquery-ui.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-route/angular-route.js',
        'bower_components/angular-resource/angular-resource.js',
        'bower_components/angular-bootstrap/ui-bootstrap.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'bower_components/angular-animate/angular-animate.js',
        'bower_components/bootstrap/dist/js/bootstrap.js',
        'bower_components/angular-dragdrop/src/angular-dragdrop.min.js',
        'bower_components/underscore/underscore.js',
        'bower_components/numeral/numeral.js',
        'bower_components/angular-numeraljs/dist/angular-numeraljs.min.js',

        'controlfrog/js/easypiechart.js',
        'controlfrog/js/excanvas.min.js',
        'controlfrog/js/gauge.js',
        'controlfrog/js/jquery.sparklines.js',
        'controlfrog/js/moment.js',
        'controlfrog/js/respond.min.js',
        'controlfrog/js/controlfrog-plugins.js',
        'controlfrog/js/controlfrog.js',
        'controlfrog/js/chart.js',

        'bower_components/highcharts/highcharts.js',

        'utils.js',
        'services.js',
        'directives.js',

        'index.js',
        'admin.js',
        'stat.js'
    ],

    css: [
        'controlfrog/css/controlfrog.css',
        'bower_components/bootstrap/dist/css/bootstrap.min.css',
        'bower_components/jquery-ui/themes/ui-lightness/jquery-ui.css',
        'bower_components/font-awesome/css/font-awesome.min.css',
        'stylesheets/style.css'
    ]
};

staticFiles.js = bluebird.resolve(staticFiles.js).map(staticFile.url);
staticFiles.css = bluebird.resolve(staticFiles.css).map(staticFile.url);

module.exports = function () {
    return function (req, res, next) {
        bluebird.all([
            staticFiles.js,
            staticFiles.css
        ]).spread(function (js, css) {
            res.locals.styles = css;
            res.locals.scripts = js;
            next();
        }).catch(next).done();
    };
};
