'use strict';

process.env.UNIT_TEST = true;

var knex = require('../src/lib/knex');
var Migrate = require('knex/lib/migrate');
var path = require('path');
var assert = require('chai').assert;
var Promise = require('bluebird');
var fs = require('fs');

describe('knex', function () {
    describe('migrate', function () {
        it('should create correct tables', function (done) {
            var migrate = new Migrate(knex);

            migrate.latest({
                directory: path.join(__dirname, '../migrations')
            }).then(function () {
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
                });
            }).then(function () {
                return migrate.rollback({
                    directory: path.join(__dirname, '../migrations')
                });
            }).then(function () {
                return Promise.all([
                    knex.schema.hasTable('projects'),
                    knex.schema.hasTable('records'),
                    knex.schema.hasTable('data_sources'),
                    knex.schema.hasTable('widgets'),
                    knex.schema.hasTable('dashboards')
                ]).then(function (rets) {
                    rets.forEach(function (ret) {
                        assert.isFalse(ret);
                    });
                });
            }).then(done);
        });
    });

    it('should work', function () {
        assert.isFunction(knex);
        assert.isFunction(knex.select);
    });

    after(function (done) {
        fs.unlink(path.join(__dirname, '../flyboard.sqlite'), done);
    });
});
