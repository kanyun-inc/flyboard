'use strict';

var User = require('../../src/logicals/user');
//var Role = require('../../src/logicals/role');
//var UserRole = require('../../src/logicals/userRole');
var assert = require('chai').assert;
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');

describe('user logical', function () {
    var userIds = null;

    beforeEach(function (done) {
        Promise.all([
            User.save({
                email: 'abc@abc.com'
            }),
            User.save({
                email: 'ab@ab.com'
            })
        ]).then(function (ids) {
            userIds = ids;
            done();
        }).catch(done);
    });

    afterEach(function (done) {
        knex('users')
            .del()
            .then(function () {
                done();
            }).catch(done);
    });

    describe('#get', function () {
        it('should return an object', function (done) {
            User.get(userIds[0]).then(function (ret) {
                assert.isObject(ret);
                assert.equal(ret.email, 'abc@abc.com');

//                UserRole.find({
//                    user_id: userIds[0]
//                }).then(function (rets){
//                    assert.equal(rets.length, 1);
//
//                    return Role.get(rets[0].role_id);
//                }).then(function (rets){
//                    assert(rets[0].scope, 2);
                    done();
//                });
            }).catch(done);
        });
    });

    describe('#find', function () {
        it('should return a list', function (done) {
            User.find().then(function (ret) {
                assert.isArray(ret);
                assert.equal(ret.length, 2);
                done();
            }).catch(done);
        });
    });

    describe('#save', function () {
        it('should save new object', function (done) {
            User.save({
                email: 'baz@baz.com'
            }).then(function (id) {
                return User.get(id);
            }).then(function (ret) {
                assert.equal(ret.email, 'baz@baz.com');
                done();
            }).catch(done);
        });
    });

    describe('#update', function () {
        it('should update a object', function (done) {
            User.save({
                email: 'baz@baz.com'
            }).then(function (id) {
                return User.update(id, {
                    email: 'xxx@xxx.com'
                }).then(function () {
                    return id;
                });
            }).then(function (ret) {
                return User.get(ret);
            }).then(function (ret) {
                assert.equal(ret.email, 'xxx@xxx.com');
            }).then(function () {
                done();
            }).catch(done);
        });
    });

    describe('#remove', function () {
        it('should delete object', function (done) {
            User.remove(userIds[0]).then(function () {
                return User.get(userIds[0]);
            }).then(function (ret) {
                assert.isUndefined(ret);
                done();
            }).catch(done);
        });
    });
});