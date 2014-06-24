'use strict';

var DataSource = require('../../src/logicals/dataSource');
var assert = require('chai').assert;
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');
var Project = require('../../src/logicals/project');

describe('data_sources model', function () {
    var ids = [];
    var projectId = null;

    beforeEach(function (done) {
        Project.save({
            name: 'foo'
        }).then(function (id) {
            projectId = id;

            return Promise.all([
                DataSource.save({
                    name: 'foo',
                    project_id: id
                }),
                DataSource.save({
                    name: 'bar',
                    project_id: id
                })
            ]);
        }).then(function (ret) {
            ids = ret;
            done();
        }).catch(done);
    });

    afterEach(function (done) {
        Promise.all([
            knex('data_sources').del(),
            knex('projects').del()
        ]).then(function () {
            done();
        }).catch(done);
    });

    describe('#get', function () {
        it('should return an object', function (done) {
            DataSource.get(ids[0]).then(function (ret) {
                assert.isObject(ret);
                assert.equal(ret.name, 'foo');
                done();
            }).catch(done);
        });
    });

    describe('#find', function () {
        it('should return a list', function (done) {
            DataSource.find().then(function (ret) {
                assert.isArray(ret);
                assert.equal(ret.length, 2);
                done();
            }).catch(done);
        });
    });

    describe('#save', function () {
        it('should save new object', function (done) {
            DataSource.save({
                name: 'baz',
                project_id: projectId
            }).then(function (id) {
                return DataSource.get(id);
            }).then(function (ret) {
                assert.equal(ret.name, 'baz');
                done();
            }).catch(done);
        });

        it.skip('should rise an exception when project not existed', function (done) {
            DataSource.save({
                name: 'test',
                project_id: 99999
            }).catch(function () {
                done();
            }).then(function () {
                assert.notOk('everything', 'project should not be created');
            }).catch(done);
        });
    });

    describe('#update', function () {
        it('should save new object', function (done) {
            DataSource.save({
                name: 'baz',
                project_id: projectId
            }).then(function (id) {
                return DataSource.update(id, {
                    name: 'xxx'
                }).then(function () {
                    return id;
                });
            }).then(function (ret) {
                return DataSource.get(ret);
            }).then(function (ret) {
                assert.equal(ret.name, 'xxx');
                done();
            }).catch(done);
        });
    });

    describe('#remove', function () {
        it('should delete object', function (done) {
            DataSource.remove(ids[0]).then(function () {
                return DataSource.get(ids[0]);
            }).then(function (ret) {
                assert.isUndefined(ret);
                done();
            }).catch(done);
        });
    });
});
