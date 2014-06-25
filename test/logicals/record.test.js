'use strict';

var Record = require('../../src/logicals/record');
var DataSource = require('../../src/logicals/dataSource');
var Project = require('../../src/logicals/project');
var assert = require('chai').assert;
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');

describe('record model', function () {
    var ids = [];
    var dataSourceId = null;

    beforeEach(function (done) {
        Project.save({
            name: 'foo'
        }).then(function (id) {
            return DataSource.save({
                name: 'foo',
                project_id: id
            });
        }).then(function (id) {
            dataSourceId = id;

            return Promise.all([
                Record.save({
                    data_source_id: dataSourceId,
                    value: 111
                }),
                Record.save({
                    data_source_id: dataSourceId,
                    value: 123
                })
            ]);
        }).then(function (ret) {
            ids = ret;
            done();
        }).catch(done);
    });

    afterEach(function (done) {
        Promise.all([
            knex('records').del(),
            knex('data_sources').del(),
            knex('projects').del()
        ]).then(function () {
            done();
        }).catch(done);
    });

    describe('#get', function () {
        it('should return an object', function (done) {
            Record.get(ids[0]).then(function (ret) {
                assert.isObject(ret);
                assert.equal(ret.data_source_id, dataSourceId);
                assert.equal(ret.id, ids[0]);
                done();
            }).catch(done);
        });
    });

    describe('#find', function () {
        it('should return a list', function (done) {
            Record.find().then(function (ret) {
                assert.isArray(ret);
                assert.equal(ret.length, 2);
                done();
            }).catch(done);
        });
    });

    describe('#save', function () {
        it('should save new object', function (done) {
            Record.save({
                data_source_id: dataSourceId,
                value: 100
            }).then(function (id) {
                return Record.get(id);
            }).then(function (ret) {
                assert.equal(ret.value, 100);
                done();
            }).catch(done);
        });
    });

    describe('#update', function () {
        it('should save new object', function (done) {
            Record.save({
                data_source_id: dataSourceId,
                value: 100
            }).then(function (id) {
                return Record.update(id, {
                    value: 200
                }).then(function () {
                    return id;
                });
            }).then(function (ret) {
                return Record.get(ret);
            }).then(function (ret) {
                assert.equal(ret.value, 200);
                done();
            }).catch(done);
        });
    });

    describe('#remove', function () {
        it('should delete object', function (done) {
            Record.remove(ids[0]).then(function () {
                return Record.get(ids[0]);
            }).then(function (ret) {
                assert.isUndefined(ret);
                done();
            }).catch(done);
        });
    });
});
