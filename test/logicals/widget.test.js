'use strict';

var Widget = require('../../src/logicals/widget');
var Dashboard = require('../../src/logicals/Dashboard');
var assert = require('chai').assert;
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');

describe('widget model', function () {
    var ids = [];
    var dashboardId = null;

    beforeEach(function (done) {
        Dashboard.save({
            name: 'foo'
        }).then(function (id) {
            dashboardId = id;

            return Promise.all([
                Widget.save({
                    dashboard_id: id,
                    type: 1,
                    config: {
                        size: 10
                    }
                }),
                Widget.save({
                    dashboard_id: id,
                    type: 1,
                    config: {
                        size: 10
                    }
                })
            ]);
        }).then(function (ret) {
            ids = ret;
            done();
        }).catch(done);
    });

    afterEach(function (done) {
        knex('widgets').del().then(function () {
            done();
        }).catch(done);
    });

    describe('#get', function () {
        it('should return an object', function (done) {
            Widget.get(ids[0]).then(function (ret) {
                assert.isObject(ret);
                assert.equal(ret.dashboard_id, dashboardId);
                assert.equal(ret.id, ids[0]);
                done();
            }).catch(done);
        });
    });

    describe('#find', function () {
        it('should return a list', function (done) {
            Widget.find().then(function (ret) {
                assert.isArray(ret);
                assert.equal(ret.length, 2);
                done();
            }).catch(done);
        });
    });

    describe('#save', function () {
        it('should save new object', function (done) {
            Widget.save({
                dashboard_id: dashboardId,
                type: 1,
                config: {
                    size: 10
                }
            }).then(function (id) {
                return Widget.get(id);
            }).then(function (ret) {
                assert.deepEqual(ret.config, {
                    size: 10
                });
                done();
            }).catch(done);
        });
    });

    describe('#update', function () {
        it('should save new object', function (done) {
            Widget.save({
                dashboard_id: 100,
                type: 1,
                config: {size: 10}
            }).then(function (id) {
                return Widget.update(id, {
                    config: {
                        size: 20
                    }
                }).then(function () {
                    return id;
                });
            }).then(function (ret) {
                return Widget.get(ret);
            }).then(function (ret) {
                assert.deepEqual(ret.config, {
                    size: 20
                });
                done();
            }).catch(done);
        });
    });

    describe('#remove', function () {
        it('should delete object', function (done) {
            Widget.remove(ids[0]).then(function () {
                return Widget.get(ids[0]);
            }).then(function (ret) {
                assert.isUndefined(ret);
                done();
            }).catch(done);
        });
    });
});
