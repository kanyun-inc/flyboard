'use strict';

process.env.UNIT_TEST = true;

var path = require('path');
var Migrate = require('knex/lib/migrate');
var knex = require('../src/lib/knex');
var fs = require('fs');
var assert = require('chai').assert;
require('../src/lib/io').init();

before(function (callback) {
    var migrate = new Migrate(knex);

    fs.unlink(path.join(__dirname, './test.db'), function (err) {
        migrate.latest({
            directory: path.join(__dirname, '../migrations')
        }).then(function () {
            callback();
        }).catch(callback);
    });
});

after(function (callback) {
    var migrate = new Migrate(knex);

    migrate.rollback({
        directory: path.join(__dirname, '../migrations')
    }).then(function () {
        fs.unlink(path.join(__dirname, './test.db'), function () {
            callback();
        });
    }).catch(callback);
});

describe('test init', function () {
    it('should set env.UNIT_TEST', function () {
        assert.equal(process.env.UNIT_TEST, 'true');
    });
});
