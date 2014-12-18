'use strict';

var app = require('../../src/app');
var request = require('supertest');
var User = require('../../src/logicals/user');
var Role = require('../../src/logicals/role');
var UserRole = require('../../src/logicals/userRole');
var DataSource = require('../../src/logicals/dataSource');
var Project = require('../../src/logicals/project');
var Record = require('../../src/logicals/record');
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');
var assert = require('chai').assert;
var tokenGenerator = require('../../src/controllers/tokenGenerator');

describe('record controller', function(){
    var userId = null;
    var roleId = null;
    var projectId = null;
    var dataSourceId = null;
    var recordId = null;
    var projectUuid = null;
    var key = null;
    var token = null;

    before(function (done) {
        User.save({
            email: 'abc@abc.com'
        }).then(function (id) {
            userId = id;

            return User.get(id);
        }).then(function (user) {
            token = tokenGenerator.generate(user);

            return Role.save({
                name: 'admin',
                scope: 2
            });
        }).then(function (id){
            roleId = id;

            return UserRole.save({
                user_id: userId,
                role_id: roleId,
                project_id: 0
            });
        }).then(function (){
            return Project.save({name: 'ape'});
        }).then(function (id) {
            projectId = id;

            return Project.get(projectId)
                .then(function (project) {
                projectUuid = project.uuid;

                return DataSource.save({
                    name: 'loginUser',
                    key: 'loginUser',
                    project_id: projectId,
                    config: {
                        dimensions: [{
                            key: 'course',
                            name: '课程'
                        },{
                            key: 'client',
                            name: '客户端'
                        },{
                            key: 'versions',
                            name: '版本号'
                        }]
                    }
                });
            });
        }).then(function (id) {
            dataSourceId = id;

            return DataSource.get(dataSourceId)
                .then(function (dataSource) {
                    key = dataSource.key;

                    return Promise.all([
                        Record.save({
                            data_source_id: dataSourceId,
                            value: 98,
                            year: 2014,
                            month: 6,
                            day: 28,
                            course: 'math',
                            client: 'ANDROID',
                            versions: '3.0.1'
                        }),
                        Record.save({
                            data_source_id: dataSourceId,
                            value: 99,
                            year: 2014,
                            month: 6,
                            day: 29,
                            course: 'languge',
                            client: 'IPHONE',
                            versions: '2.0.3'
                        }),
                        Record.save({
                            data_source_id: dataSourceId,
                            value: 100,
                            year: 2014,
                            month: 6,
                            day: 30,
                            course: 'music',
                            client: 'ANDROID',
                            versions: '3.0.1'
                        })
                    ]);
                });
        })
        .then(function () {
            done();
        }).catch(done);
    });

    after(function (done) {
        return Promise.all([
            knex('users').del(),
            knex('roles').del(),
            knex('user_role').del(),
            knex('data_sources').del(),
            knex('projects').del(),
            knex('records').del()
        ]).then(function () {
            done();
        }).catch(done);
    });

    describe('POST /api/projects/:uuid/data_sources/:key', function (){
        it('should create a record', function (done){

            request(app)
                .post('/api/projects/' + projectUuid + '/data_sources/' + key + '?token=' + token)
                .send({
                    value: 100,
                    course: 'english',
                    client: 'ANDROID',
                    versions: '3.0.1'
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(function(err, res){
                    if(err){
                        return done(err);
                    }

                    recordId = res.body.id;
                    done();
                });
            });
    });

    describe('GET /api/records/:id', function(){
        it('should return a record object', function(done){
            request(app)
                .get('/api/records/' + recordId + '?token=' + token)
                .expect('content-type', /json/)
                .expect(200)
                .expect(function (res) {
                    assert.equal(res.body.course, 'english');
                    assert.equal(res.body.client, 'ANDROID');
                    assert.equal(res.body.versions, '3.0.1');
                })
                .end(done);
        });
    });

    describe('GET /api/data_sources/:id/records', function(){
        it('should return limit numbers of record', function (done){
            request(app)
                .get('/api/data_sources/' + dataSourceId + '/records?limit=4' + '&token=' + token)
                .expect(200)
                .expect('content-type', /json/)
                .end(done);
        });

        it('should return  record list', function (done){
            request(app)
                .get('/api/data_sources/' + dataSourceId + '/records' + '?token=' + token)
                .expect(200)
                .expect('content-type', /json/)
                .end(done);
        });
    });

    describe('DELETE /api/records/:id', function(){
        it('should remove record', function(done){
            request(app)
                .delete('/api/records/' + recordId + '?token=' + token)
                .expect(200)
                .end(function(err){
                    if(err){
                        return done(err);
                    }

                    request(app)
                        .get('/api/records/' + recordId + '?token=' + token)
                        .expect('content-type', /json/)
                        .expect(404, done);
                });
        });
    });

    describe('DELETE /api/data_sources/:id/records', function(){
        it('should remove all records', function(done){
            request(app)
                .delete('/api/data_sources/' + dataSourceId + '/records' + '?token=' + token)
                .expect(200)
                .end(function(err){
                    if(err){
                        return done(err);
                    }

                    request(app)
                        .get('/api/data_sources/' + dataSourceId + '/records' + '?token=' + token)
                        .expect('content-type', /json/)
                        .expect(200)
                        .expect(function (res){
                            assert.equal(res.body.length, 0);
                        })
                        .end(done);
                });
        });
    });
});