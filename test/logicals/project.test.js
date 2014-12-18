'use strict';

var Project = require('../../src/logicals/project');
var User = require('../../src/logicals/user');
var Role = require('../../src/logicals/role');
var UserRole = require('../../src/logicals/userRole');
var assert = require('chai').assert;
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');

describe('project logical', function () {
    var ids = [];
    var userIds = [];
    var roleIds = [];

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

            return Promise.all([
                User.save({
                    email: 'abc@abc.com',
                    salt: 'fwaewuihui'
                }),
                User.save({
                    email: 'ab@ab.com',
                    salt: 'sdfaw9eurwe'
                })
            ]);
        }).then(function (ret){
            userIds = ret;

            return Promise.all([
                Role.save({
                    name: 'admin',
                    scope: 2
                }),
                Role.save({
                    name: 'member',
                    scope: 1
                })
            ]);
        }).then(function (ret) {
            roleIds = ret;

            return Promise.all([
                UserRole.save({
                    user_id: userIds[0],
                    role_id: roleIds[0],
                    project_id: 0
                }),
                UserRole.save({
                    user_id: userIds[1],
                    role_id: roleIds[1],
                    project_id: ids[0]
                })
            ]);
        }).then(function (){
            done();
        }).catch(done);
    });

    afterEach(function (done) {
        Promise.all([
            knex('projects').del(),
            knex('users').del(),
            knex('roles').del(),
            knex('user_role').del()
        ]).then(function () {
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
        it('should return a list of 2 projects', function (done) {
            Project.find({
                user_id: userIds[0]
            }).then(function (ret) {
                assert.isArray(ret);
                assert.equal(ret.length, 2);
                done();
            }).catch(done);
        });
        it('should return a list of 1 project', function (done) {
            Project.find({
                user_id: userIds[1]
            }).then(function (ret) {
                assert.isArray(ret);
                assert.equal(ret.length, 1);
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
        it('should update a object', function (done) {
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
