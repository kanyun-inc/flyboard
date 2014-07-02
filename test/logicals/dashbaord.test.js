'use strict';

var Dashboard = require('../../src/logicals/dashboard');
var assert = require('chai').assert;
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');

describe('Dashboard logical', function () {
    var ids = [];

    beforeEach(function (done) {
        Promise.all([
            Dashboard.save({
                name: 'foo',
                config: {
                    layout: [{
                        id: 1,
                        columns: 12
                    }, [{
                        id: 2,
                        columns: 6
                    }, {
                        id: 3,
                        columns: 6
                    }]]
                }
            }),
            Dashboard.save({
                name: 'bar'
            })
        ]).then(function (ret) {
            ids = ret;
            done();
        }).catch(done);
    });

    afterEach(function (done) {
        knex('dashboards').del().then(function () {
            done();
        }).catch(done);
    });

    describe('#get', function () {
        it('should return an object', function (done) {
            Dashboard.get(ids[0]).then(function (ret) {
                assert.isObject(ret);
                assert.isObject(ret.config);
                assert.deepEqual(ret.config, {
                    layout: [{
                        id: 1,
                        columns: 12
                    }, [{
                        id: 2,
                        columns: 6
                    }, {
                        id: 3,
                        columns: 6
                    }]]
                });
                assert.equal(ret.name, 'foo');
                done();
            }).catch(done);
        });
    });

    describe('#find', function () {
        it('should return a list', function (done) {
            Dashboard.find().then(function (ret) {
                assert.isArray(ret);
                assert.equal(ret.length, 2);
                done();
            }).catch(done);
        });
    });

    describe('#save', function () {
        it('should save new object', function (done) {
            Dashboard.save({
                name: 'baz'
            }).then(function (id) {
                return Dashboard.get(id);
            }).then(function (ret) {
                assert.equal(ret.name, 'baz');
                done();
            }).catch(done);
        });
    });

    describe('#update', function () {
        it('should save new object', function (done) {
            Dashboard.save({
                name: 'baz'
            }).then(function (id) {
                return Dashboard.update(id, {
                    name: 'xxx'
                }).then(function () {
                    return id;
                });
            }).then(function (ret) {
                return Dashboard.get(ret);
            }).then(function (ret) {
                assert.equal(ret.name, 'xxx');
                done();
            }).catch(done);
        });
    });

    describe('#remove', function () {
        it('should delete object', function (done) {
            Dashboard.remove(ids[0]).then(function () {
                return Dashboard.get(ids[0]);
            }).then(function (ret) {
                assert.isUndefined(ret);
                done();
            }).catch(done);
        });
    });
});
