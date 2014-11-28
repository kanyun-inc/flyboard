'use strict';

var Role = require('../../src/logicals/role');
var assert = require('chai').assert;
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');

describe('role logical', function () {
    var roleId = null;

    beforeEach(function (done) {
        Role.save({
            name: 'admin',
            scope: 2
        }).then(function (ret) {
            roleId = ret;
            done();
        }).catch(done);
    });

    afterEach(function (done) {
        knex('roles')
            .del()
            .then(function () {
                done();
            }).catch(done);
    });

    describe('#get', function () {
        it('should return an object', function (done) {
            Role.get(roleId).then(function (ret) {
                assert.isObject(ret);
                assert.equal(ret.name, 'admin');
                done();
            }).catch(done);
        });
    });

    describe('#find', function () {
        it('should return a list', function (done) {
            Role.find().then(function (ret) {
                assert.isArray(ret);
                assert.equal(ret.length, 1);
                done();
            }).catch(done);
        });
    });

    describe('#save', function () {
        it('should save new object', function (done) {
            Role.save({
                name: 'member',
                scope: 1
            }).then(function (id) {
                return Role.get(id);
            }).then(function (ret) {
                assert.equal(ret.name, 'member');
                assert.equal(ret.scope, 1);
                done();
            }).catch(done);
        });
    });

    describe('#update', function () {
        it('should update a object', function (done) {
            Role.save({
                name: 'member',
                scope: 1
            }).then(function (id) {
                return Role.update(id, {
                    name: 'team member'
                }).then(function () {
                    return id;
                });
            }).then(function (id) {
                return Role.get(id);
            }).then(function (ret) {
                assert.equal(ret.name, 'team member');
                done();
            }).catch(done);
        });
    });

    describe('#remove', function () {
        it('should delete object', function (done) {
            Role.remove(roleId).then(function () {
                return Role.get(roleId);
            }).then(function (ret) {
                assert.isUndefined(ret);
                done();
            }).catch(done);
        });
    });
});
