'use strict';

process.env.UNIT_TEST = true;

var assert = require('chai').assert;
var app = require('../src/app');

describe('app', function () {
    it('should be a function', function () {
        assert.isFunction(app);
    });
});
