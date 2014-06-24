'use strict';

process.env.UNIT_TEST = true;

var knex = require('../src/lib/knex');
var Migrate = require('knex/lib/migrate');
var path = require('path');
var assert = require('chai').assert;
var Promise = require('bluebird');
var fs = require('fs');

var Project = require('../src/logicals/project');

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
            }).then(done);
        });
    });

    it('should work', function () {
        assert.isFunction(knex);
        assert.isFunction(knex.select);
    });

    /* -------------------- Project Model ----------------------- */
    describe('project model', function () {
        beforeEach(function (done) {
            Promise.all([
                knex('projects').insert({
                    name: 'foo'
                }),
                knex('projects').insert({
                    name: 'bar'
                })
            ]).then(function () {
                done();
            });
        });

        describe('#get', function () {
            it('should return an object', function (done) {
                Project.get(1).then(function (ret) {
                    assert.isObject(ret);
                    assert.equal(ret.name, 'foo');
                    done();
                });
            });
        });

        describe('#find', function () {
            it('should return a list', function (done) {
                Project.find().then(function (ret) {
                    assert.isArray(ret);
                    assert.equal(ret.length, 2);
                    done();
                });
            });
        });

        describe('#save', function () {
            it('shoule save new object', function (done) {
                Project.save({
                    name: 'baz'
                }).then(function (id) {
                    return Project.get(id);
                }).then(function (ret) {
                    assert.equal(ret.name, 'baz');
                    done();
                });
            });
        });

        describe('#update', function () {
            it('shoule save new object', function (done) {
                Project.save({
                    name: 'baz'
                }).then(function (id) {
                    return Project.update(id, {
                        name: 'xxx'
                    }).then(function () {
                        return id;
                    });
                }).then(function (ret) {
                    return Project.get(ret);
                }).then(function (ret) {
                    assert.equal(ret.name, 'xxx');
                    done();
                });
            });
        });

        describe('#remove', function () {
            it('shoule delete object', function (done) {
                Project.remove(1).then(function () {
                    return Project.get(1);
                }).then(function (ret) {
                    assert.isUndefined(ret);
                    done();
                });
            });
        });

        afterEach(function (done) {
            knex('projects').del().then(function () {
                done();
            });
        });
    });

    after(function (done) {
        fs.unlink(path.join(__dirname, '../flyboard.sqlite'), done);
    });
});
