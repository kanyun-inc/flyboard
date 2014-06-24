'use strict';

var Project = require('../../src/logicals/project');
var assert = require('chai').assert;
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');

describe('Project logical', function () {
    var ids = [];

    beforeEach(function (done) {
        Promise.all([
            Project.save({
                name: 'foo'
            }),
            Project.save({
                name: 'bar'
            })
        ]).then(function (ret) {
            ids = ret;
            done();
        });
    });

    afterEach(function (done) {
        knex('projects').del().then(function () {
            done();
        }).catch(done);
    });

    describe('#get', function () {
        it('should return an object', function (done) {
            Project.get(ids[0]).then(function (ret) {
                assert.isObject(ret);
                assert.equal(ret.name, 'foo');
                done();
            }).catch(done);
        });
    });

    describe('#find', function () {
        it('should return a list', function (done) {
            Project.find().then(function (ret) {
                assert.isArray(ret);
                assert.equal(ret.length, 2);
                done();
            }).catch(done);
        });
    });

    describe('#save', function () {
        it('should save new object', function (done) {
            Project.save({
                name: 'baz'
            }).then(function (id) {
                return Project.get(id);
            }).then(function (ret) {
                assert.equal(ret.name, 'baz');
                done();
            }).catch(done);
        });
    });

    describe('#update', function () {
        it('should save new object', function (done) {
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
            }).catch(done);
        });
    });

    describe('#remove', function () {
        it('should delete object', function (done) {
            Project.remove(ids[0]).then(function () {
                return Project.get(ids[0]);
            }).then(function (ret) {
                assert.isUndefined(ret);
                done();
            }).catch(done);
        });
    });
});
