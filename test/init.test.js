'use strict';

process.env.UNIT_TEST = true;

var path = require('path');
var Migrate = require('knex/lib/migrate');
var knex = require('../src/lib/knex');
var fs = require('fs');
var assert = require('chai').assert;

before(function (callback) {
    var migrate = new Migrate(knex);

    migrate.latest({
        directory: path.join(__dirname, '../migrations')
    }).then(function () {
        callback();
    }).catch(callback);
});

after(function (callback) {
    fs.unlink(path.join(__dirname, '../flyboard.sqlite'), function () {
        callback();
    });
});

describe('test init', function () {
    it('should set env.UNIT_TEST', function () {
        assert.equal(process.env.UNIT_TEST, 'true');
    });
});
