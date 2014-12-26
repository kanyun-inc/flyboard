'use strict';

var User = require('../../src/logicals/user');
var Role = require('../../src/logicals/role');
var RolePrivilege = require('../../src/logicals/rolePrivilege');
var assert = require('chai').assert;
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');

describe('role_privilege logical', function () {
    var userId = null;
    var roleIds = null;

    beforeEach(function (done) {
        User.save({
            email: 'abc@abc.com'
        }).then(function (id){
            userId = id;
        }).then(function (){
            return Promise.all([
                Role.save({
                    name: 'member',
                    scope: 1
                }),
                Role.save({
                    name: 'admin',
                    scope: 2
                })
            ]);
        }).then(function (ids) {
            roleIds = ids;
            return Promise.all([
                RolePrivilege.save({
                    resource: 'PROJECT',
                    operation: 'GET',
                    role_id: roleIds[0]
                }),
                RolePrivilege.save({
                    resource: 'PROJECT',
                    operation: 'POST',
                    role_id: roleIds[1]
                })
            ]);
        }).then(function (ids){
            done();
        }).catch(done);
    });

    afterEach(function (done) {
        Promise.all([
            knex('users').del(),
            knex('roles').del(),
            knex('role_privileges').del()
        ]).then(function () {
            done();
        }).catch(done);
    });

    describe('#find', function () {
        it('should return a list', function (done) {
            RolePrivilege.find().then(function (ret) {
                assert.isArray(ret);
                assert.equal(ret.length, 2);
                done();
            }).catch(done);
        });
    });

    describe('#save', function () {
        it('should save new object', function (done) {
            RolePrivilege.save({
                resource: 'PROJECT',
                operation: 'UPDATE',
                role_id: roleIds[1]
            }).then(function () {
                return RolePrivilege.find({
                    role_id: roleIds[1]
                });
            }).then(function (ret) {
                assert.isArray(ret);
                assert.equal(ret.length, 2);
                var rolePrivilege = ret[1];
                assert.equal(rolePrivilege.resource, 'PROJECT');
                assert.equal(rolePrivilege.operation, 'UPDATE');
                assert.equal(rolePrivilege.role_id, roleIds[1]);
                done();
            }).catch(done);
        });
    });
});