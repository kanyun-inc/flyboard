'use strict';

var app = require('../../src/app');
var request = require('supertest');
var Project = require('../../src/logicals/project');
var Dashboard = require('../../src/logicals/dashboard');
var User = require('../../src/logicals/user');
var Role = require('../../src/logicals/role');
var UserRole = require('../../src/logicals/userRole');
var RolePrivilege = require('../../src/logicals/rolePrivilege');
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');
var tokenGenerator = require('../../src/controllers/tokenGenerator');

describe('dashboard controller', function(){
    var userIds = [];
    var roleIds = [];
    var projectIds = [];
    var dashboardIds = null;
    var tokens = [];

    before(function (done) {
        Promise.all([
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
        }).then(function (ret){
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
        }).then(function () {
            return Promise.all([
                Dashboard.save({
                    name: 'board1',
                    project_id: projectIds[0]
                }),
                Dashboard.save({
                    name: 'board2',
                    project_id: projectIds[1]
                })
            ]);
        }).then(function (ret){
            dashboardIds = ret;
            done();
        }).catch(done);
    });

    after(function (done) {
        return Promise.all([
            knex('users').del(),
            knex('roles').del(),
            knex('user_roles').del(),
            knex('role_privileges').del(),
            knex('dashboards').del(),
            knex('projects').del()
        ]).then(function () {
            done();
        }).catch(done);
    });

    describe('GET /api/dashboards', function(){
        it('should return dashboard list of the project, length is 1', function(done){
            request(app)
                .get('/api/dashboards' + '?project_id=' + projectIds[0] + '&token=' + tokens[0])
                .expect('content-type', /json/)
                .expect(200)
                .expect(function (res){
                    if(res.body.length !== 1){
                        throw new Error('ret length invalid');
                    }
                })
                .end(done);
        });

        it('should return dashboard list of the global user, length is 2', function(done){
            request(app)
                .get('/api/dashboards' + '?token=' + tokens[0])
                .expect('content-type', /json/)
                .expect(200)
                .expect(function (res){
                    if(res.body.length !== 2){
                        throw new Error('ret length invalid');
                    }
                })
                .end(done);
        });

        it('should return dashboard list of the local user, length is 1', function(done){
            request(app)
                .get('/api/dashboards' + '?token=' + tokens[1])
                .expect('content-type', /json/)
                .expect(200)
                .expect(function (res){
                    if(res.body.length !== 1){
                        throw new Error('ret length invalid');
                    }
                })
                .end(done);
        });
    });

    describe('POST /api/dashboards', function(){
        it('should create a dashboard', function(done){
            request(app)
                .post('/api/dashboards' + '?token=' + tokens[0])
                .send({
                    name: 'users',
                    project_id: projectIds[0]
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(function(err, res){
                    if(err){
                        return done(err);
                    }
                    done();
                });
        });
    });

    describe('GET /api/dashboards/:id', function(){
        it('should return a dashboard object', function(done){
            request(app)
                .get('/api/dashboards/' + dashboardIds[0] + '?token=' + tokens[0])
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT /api/dashboards/:id', function (){
        it('should update a dashboard', function (done){
            request(app)
                .put('/api/dashboards/' + dashboardIds[0] + '?token=' + tokens[0])
                .send({
                    name: 'apt',
                    project_id: projectIds[0],
                    config: {
                        layout:[
                            {'id':3,'first_grid':[0,0],'last_grid':[1,1]}
                        ]
                    }
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(done);
        });

        it('should update config of dashboard', function (done) {
            request(app)
                .put('/api/dashboards/' + dashboardIds[0] + '?token=' + tokens[0])
                .send({
                    name: 'apt',
                    project_id: projectIds[0],
                    config: {
                        layout:[
                            {'id':3,'first_grid':[0,0],'last_grid':[1,1]},
                            {'id':465,'first_grid':[4,0],'last_grid':[8,5]}
                        ]
                    }
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(done);
        });

        it('should return 400 if data is invalid', function (done) {
            request(app)
                .put('/api/dashboards/' + dashboardIds[0] + '?token=' + tokens[0])
                .send({
                    name: null
                })
                .expect(400)
                .end(done);
        });
    });

    describe('DELETE /api/dashboards/:id', function(){
        it('should delete a dashboard', function(done){
            request(app)
                .delete('/api/dashboards/' + dashboardIds[0] + '?token=' + tokens[0])
                .expect(200)
                .end(function(err){
                    if(err){
                        return done(err);
                    }

                    request(app)
                        .get('/api/dashboards/' + dashboardIds[0] + '?token=' + tokens[0])
                        .expect('content-type', /json/)
                        .expect(404, done);
                });
        });
    });
});
