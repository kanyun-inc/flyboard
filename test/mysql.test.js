'use strict';

process.env.UNIT_TEST = true;

var mysql = require('../lib/mysql');
var assert = require('chai').assert;


describe('mysql', function () {
    it('should be a function', function () {
        assert.isFunction(mysql.query);
    });

    it('should return a promise', function () {
        assert.isFunction(mysql.query().then);
    });
});
