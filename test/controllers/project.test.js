'use strict';

var app = require('../../src/app');
var request = require('supertest');
var Project = require('../../src/logicals/project');
var User = require('../../src/logicals/user');
var Role = require('../../src/logicals/role');
var UserRole = require('../../src/logicals/userRole');
var RolePrivilege = require('../../src/logicals/rolePrivilege');
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');
var tokenGenerator = require('../../src/controllers/tokenGenerator');

describe('project controller', function () {
    var userIds = [];
    var roleIds = [];
    var projectIds = [];
    var tokens = [];

    before(function (done) {
        return Promise.all([
            Project.save({
                name: 'ape'
            }),
            Project.save({
                name: 'abc'
            })
        ]).then(function (ret) {
            projectIds = ret;

            return Promise.all([
                User.save({
                    email: 'abc@abc.com'
                }),
                User.save({
                    email: 'ab@ab.com'
                })
            ]);
        }).then(function (ret) {
            userIds = ret;

            return Promise.all([
                User.get(userIds[0]),
                User.get(userIds[1])
            ]);
        }).then(function (users) {
            tokens = users.map(function (user) {
                return tokenGenerator.generate(user);
            });

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
                    project_id: projectIds[0]
                })
            ]);
        }).then(function () {
            return Promise.all([
                RolePrivilege.save({
                    resource: 'PROJECT',
                    operation: 'GET',
                    role_id: roleIds[0]
                }),
                RolePrivilege.save({
                    resource: 'PROJECT',
                    operation: 'POST',
                    role_id: roleIds[0]
                }),
                RolePrivilege.save({
                    resource: 'PROJECT',
                    operation: 'PUT',
                    role_id: roleIds[0]
                }),
                RolePrivilege.save({
                    resource: 'PROJECT',
                    operation: 'DELETE',
                    role_id: roleIds[0]
                }),
                RolePrivilege.save({
                    resource: 'PROJECT',
                    operation: 'GET',
                    role_id: roleIds[1]
                }),
                RolePrivilege.save({
                    resource: 'PROJECT',
                    operation: 'PUT',
                    role_id: roleIds[1]
                })
            ]);
        }).then(function (){
            done();
        }).catch(done);
    });

    after(function (done) {
        return Promise.all([
            knex('users').del(),
            knex('roles').del(),
            knex('user_roles').del(),
            knex('role_privileges').del(),
            knex('projects').del()
        ]).then(function () {
            done();
        }).catch(done);
    });

    describe('GET /api/projects', function () {
        it('should return project list', function (done) {
            request(app)
                .get('/api/projects' + '?token=' + tokens[0])
                .expect('content-type', /json/)
                .expect(function (res){
                    if(res.body.length !== 2){
                        throw new Error('ret length invalid');
                    }
                }).end(done);
        });
        it('should return project list', function (done) {
            request(app)
                .get('/api/projects' + '?token=' + tokens[1])
                .expect('content-type', /json/)
                .expect(function (res){
                    if(res.body.length !== 1){
                        throw new Error('ret length invalid');
                    }
                }).end(done);
        });
    });

    describe('POST /api/projects', function () {
        it('should create a project', function (done) {
            request(app)
                .post('/api/projects' + '?token=' + tokens[0])
                .send({
                    name: 'ape'
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(done);
        });
        it('should fail to create a project', function (done) {
            request(app)
                .post('/api/projects' + '?token=' + tokens[1])
                .send({
                    name: 'ape'
                })
                .expect(403)
                .end(done);
        });
    });

    describe('GET /api/projects', function () {
        it('should return project list', function (done) {
            request(app)
                .get('/api/projects' + '?token=' + tokens[0])
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('GET /api/projects/:id', function () {
        it('should return a project object', function (done) {
            request(app)
                .get('/api/projects/' + projectIds[0] + '?token=' + tokens[0])
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT /api/projects/:id', function (){
        it('should update a project', function (done){
            request(app)
                .put('/api/projects/' + projectIds[0] + '?token=' + tokens[0])
                .send({
                    name: 'apt'
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(done);
        });
    });

    describe('DELETE /api/projects/:id', function () {
        it('should remove project', function (done) {
            request(app)
                .delete('/api/projects/' + projectIds[0] + '?token=' + tokens[0])
                .expect(200)
                .end(function (err) {
                    if (err) {
                        return done(err);
                    }

                    request(app)
                        .get('/api/projects/' + projectIds[0] + '?token=' + tokens[0])
                        .expect('content-type', /json/)
                        .expect(404, done);
                });
        });
    });
});
