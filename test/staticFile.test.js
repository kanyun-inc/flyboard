'use strict';

process.env.UNIT_TEST = true;

var assert = require('chai').assert;
var staticFile = require('../src/lib/staticFile');
var middleware = require('../src/middlewares/staticFile');

describe('staticFile#url', function () {
    it('should return a url with file hash', function (done) {
        staticFile.url('bower_components/angular/angular.min.js').then(function (url) {
            assert.equal(url, '/public/bower_components/angular/angular.min.js?d0b66b1a56c58842a056237ed4f06d3f32198fc3');
            done();
        });
    });
});

describe('staticFile#middleware', function () {
    it('should set scripts and styles to res.locals', function (done) {
        var mw = middleware();
        var res = {
            locals: {}
        };

        mw(null, res, function () {
            assert.isArray(res.locals.scripts);
            assert.isArray(res.locals.styles);

            res.locals.scripts.forEach(function (url) {
                assert.isString(url);
            });

            res.locals.styles.forEach(function (url) {
                assert.isString(url);
            });

            done();
        });
    });
});
