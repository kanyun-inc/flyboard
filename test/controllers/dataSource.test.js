'use strict';

var app = require('../../src/app');
var request = require('supertest');
var promisedRequest = require('supertest-as-promised');
var User = require('../../src/logicals/user');
var Role = require('../../src/logicals/role');
var UserRole = require('../../src/logicals/userRole');
var RolePrivilege = require('../../src/logicals/rolePrivilege');
var Record = require('../../src/logicals/record');
var DataSource = require('../../src/logicals/dataSource');
var Project = require('../../src/logicals/project');
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');
var tokenGenerator = require('../../src/controllers/tokenGenerator');

describe('dataSource controller', function(){
    var userIds = [];
    var roleIds = [];
    var projectIds = [];
    var dataSourceIds = [];
    var recordId = null;
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
                DataSource.save({
                    name: 'loginUser',
                    key: 'loginUser',
                    project_id: projectIds[0]
                }),
                DataSource.save({
                    name: 'logoutUser',
                    key: 'logoutUser',
                    project_id: projectIds[1]
                })
            ]);
        }).then(function (ret) {
            dataSourceIds = ret;

            return Record.save({
                data_source_id: dataSourceIds[0],
                value: 98,
                year: 2014,
                month: 6,
                day: 28
            });
        }).then(function (id) {
            recordId = id;
            done();
        }).catch(done);
    });

    after(function (done) {
        return Promise.all([
            knex('users').del(),
            knex('roles').del(),
            knex('user_roles').del(),
            knex('role_privileges').del(),
            knex('projects').del(),
            knex('data_sources').del()
        ]).then(function () {
            done();
        }).catch(done);
    });

    describe('GET /api/data_sources', function (){
        it('should return dataSource list of the project, length is 1', function(done){
            request(app)
                .get('/api/data_sources' + '?project_id=' + projectIds[0] + '&token=' + tokens[0])
                .expect('content-type', /json/)
                .expect(200)
                .expect(function (res){
                    if(res.body.length !== 1){
                        throw new Error('ret length invalid');
                    }
                })
                .end(done);
        });

        it('should return dataSource list of the global user, length is 2', function(done){
            request(app)
                .get('/api/data_sources' + '?token=' + tokens[0])
                .expect('content-type', /json/)
                .expect(200)
                .expect(function (res){
                    if(res.body.length !== 2){
                        throw new Error('ret length invalid');
                    }
                })
                .end(done);
        });

        it('should return dataSource list of the local user, length is 1', function(done){
            request(app)
                .get('/api/data_sources' + '?token=' + tokens[1])
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

    describe('POST /api/data_sources', function(){
        it('should create a dataSource', function (done){
            request(app)
                .post('/api/data_sources' + '?token=' + tokens[0])
                .send({
                    project_id: projectIds[0],
                    name: '登录时间',
                    key: 'loginTime'
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(done);
        });
        it('should reject to create a dataSource', function (done){
            request(app)
                .post('/api/data_sources' + '?token=' + tokens[0])
                .send({
                    project_id: projectIds[0],
                    name: '登出时间',
                    key: 'logoutTime',
                    config: {
                        dimensions: [{
                            key: 'school',
                            name: '学校'
                        },{
                            key: 'class',
                            name: '班级'
                        },{
                            key: 'course',
                            name: '课程'
                        },{
                            key: 'country',
                            name: '国家'
                        }]
                    }
                })
                .expect(400)
                .expect('content-type', /json/)
                .end(done);
        });
    });

    describe('GET /api/data_sources/:id', function (){
        it('should return a dataSource', function(done){
            request(app)
                .get('/api/data_sources/' + dataSourceIds[0] + '?token=' + tokens[0])
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT /api/data_sources/:id', function () {
        it('should update a dataSource', function(done){
            request(app)
                .put('/api/data_sources/' + dataSourceIds[0] + '?token=' + tokens[0])
                .send({
                    name: 'loginDate',
                    project_id: projectIds[0]
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(done);
        });
    });

    describe('DELETE /api/data_sources/:id', function (){
        it('should delete a dataSource', function(done){
            request(app)
                .delete('/api/data_sources/' + dataSourceIds[0] + '?token=' + tokens[0])
                .expect(200)
                .end(function (err){
                    if(err){
                        return done(err);
                    }

                    promisedRequest(app)
                        .get('/api/data_sources/' + dataSourceIds[0] + '?token=' + tokens[0])
                        .expect('content-type', /json/)
                        .expect(404)
                        .then(function () {
                            return promisedRequest(app)
                                .get('/api/records/' + recordId + '?token=' + tokens[0])
                                .expect('content-type', /json/)
                                .expect(404);
                        }).then(function () {
                            done();
                        });
                });
        });
    });
});