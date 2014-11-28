'use strict';

var User = require('../../src/logicals/user');
var Role = require('../../src/logicals/role');
var UserRole = require('../../src/logicals/userRole');
var Project = require('../../src/logicals/project');
var assert = require('chai').assert;
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');

describe('user_role logical', function () {
    var userId = null;
    var roleId = null;
    var projectIds = null;
    var userRoleId = null;

    beforeEach(function (done) {
        User.save({
            email: 'abc@abc.com'
        }).then(function (id){
            userId = id;
        }).then(function (){
            return Role.save({
                name: 'member',
                scope: 1
            });
        }).then(function (id) {
            roleId = id;
            return Promise.all([
                Project.save({
                    name: 'test'
                }),
                Project.save({
                    name: 'home'
                })
            ]);
        }).then(function (ids) {
            projectIds = ids;
            return UserRole.save({
                user_id: userId,
                role_id: roleId,
                project_id: 0
            });
        }).then(function (id){
            userRoleId = id;
            done();
        }).catch(done);
    });

    afterEach(function (done) {
        Promise.all([
            knex('users').del(),
            knex('roles').del(),
            knex('projects').del(),
            knex('user_role').del()
        ]).then(function () {
            done();
        }).catch(done);
    });

    describe('#get', function () {
        it('should return an object', function (done) {
            UserRole.get(userRoleId).then(function (ret) {
                assert.isObject(ret);
                assert.equal(ret.user_id, userId);
                assert.equal(ret.role_id, roleId);
                assert.equal(ret.project_id, 0);
                done();
            }).catch(done);
        });
    });

    describe('#find', function () {
        it('should return a list', function (done) {
            UserRole.find().then(function (ret) {
                assert.isArray(ret);
                assert.equal(ret.length, 1);
                done();
            }).catch(done);
        });
    });

    describe('#save', function () {
        it('should save new object', function (done) {
            UserRole.save({
                user_id: userId,
                role_id: roleId,
                project_id: projectIds[0]
            }).then(function (id) {
                return UserRole.get(id);
            }).then(function (ret) {
                assert.equal(ret.user_id, userId);
                assert.equal(ret.role_id, roleId);
                assert.equal(ret.project_id, projectIds[0]);
                done();
            }).catch(done);
        });
    });

    describe('#update', function () {
        it('should update a object', function (done) {
            UserRole.save({
                user_id: userId,
                role_id: roleId,
                project_id: projectIds[0]
            }).then(function (id) {
                return UserRole.update(id, {
                    user_id: userId,
                    role_id: roleId,
                    project_id: projectIds[1]
                }).then(function () {
                    return id;
                });
            }).then(function (ret) {
                return UserRole.get(ret);
            }).then(function (ret) {
                assert.equal(ret.project_id, projectIds[1]);
            }).then(function () {
                done();
            }).catch(done);
        });
    });

    describe('#remove', function () {
        it('should delete object', function (done) {
            UserRole.remove(userRoleId).then(function () {
                return UserRole.get(userRoleId);
            }).then(function (ret) {
                assert.isUndefined(ret);
                done();
            }).catch(done);
        });
    });
});