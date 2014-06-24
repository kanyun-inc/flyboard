'use strict';

var knex = require('../src/lib/knex');
var assert = require('chai').assert;

describe('knex', function () {
    it('should work', function () {
        assert.isFunction(knex);
        assert.isFunction(knex.select);
    });
});
