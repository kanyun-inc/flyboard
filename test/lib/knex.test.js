'use strict';

process.env.UNIT_TEST = true;

var knex = require('../../src/lib/knex');
var assert = require('chai').assert;
var Promise = require('bluebird');

describe('knex', function () {
    describe('migrate', function () {
        it('should create correct tables', function (done) {
            return Promise.all([
                knex.schema.hasTable('projects'),
                knex.schema.hasTable('records'),
                knex.schema.hasTable('data_sources'),
                knex.schema.hasTable('widgets'),
                knex.schema.hasTable('dashboards')
            ]).then(function (rets) {
                rets.forEach(function (ret) {
                    assert.isTrue(ret);
                });
                done();
            }).catch(done);
        });
    });

    it('should work', function () {
        assert.isFunction(knex);
        assert.isFunction(knex.select);
    });
});
