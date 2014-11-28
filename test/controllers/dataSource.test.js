'use strict';

var app = require('../../src/app');
var request = require('supertest');
var promisedRequest = require('supertest-as-promised');
var User = require('../../src/logicals/user');
var Record = require('../../src/logicals/record');
var DataSource = require('../../src/logicals/dataSource');
var Project = require('../../src/logicals/project');
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');
var tokenGenerator = require('../../src/controllers/tokenGenerator');

describe('dataSource controller', function(){
    var userId = null;
    var projectId = null;
    var dataSourceId = null;
    var recordId = null;
    var token = null;

    before(function (done) {
        User.save({
            email: 'abc@abc.com'
        }).then(function (id) {
            userId = id;
            return User.get(id);
        }).then(function (user) {
            token = tokenGenerator.generate(user);
            return Project.save({
                name: 'ape'
            });
        }).then(function (id) {
            projectId = id;

            return DataSource.save({
                name: 'loginUser',
                key: 'loginUser',
                project_id: id
            });
        }).then(function (id) {
            dataSourceId = id;

            return Record.save({
                data_source_id: dataSourceId,
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
            knex('projects').del(),
            knex('data_sources').del()
        ]).then(function () {
            done();
        }).catch(done);
    });

    describe('POST /api/data_sources', function(){
        it('should create a dataSource', function (done){
            request(app)
                .post('/api/data_sources' + '?token=' + token)
                .send({
                    project_id: projectId,
                    name: '登录时间',
                    key: 'loginTime'
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(done);
        });
        it('should reject to create a dataSource', function (done){
            request(app)
                .post('/api/data_sources' + '?token=' + token)
                .send({
                    project_id: projectId,
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

    describe('GET /api/data_sources', function (){
        it('should return dataSource list', function(done){
            request(app)
                .get('/api/data_sources' + '?token=' + token)
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('GET /api/data_sources/:id', function (){
        it('should return a dataSource', function(done){
            request(app)
                .get('/api/data_sources/' + dataSourceId + '?token=' + token)
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT /api/data_sources/:id', function () {
        it('should update a dataSource', function(done){
            request(app)
                .put('/api/data_sources/' + dataSourceId + '?token=' + token)
                .send({
                    name: 'loginDate',
                    project_id: projectId
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(done);
        });
    });

    describe('DELETE /api/data_sources/:id', function (){
        it('should delete a dataSource', function(done){
            request(app)
                .delete('/api/data_sources/' + dataSourceId + '?token=' + token)
                .expect(200)
                .end(function (err){
                    if(err){
                        return done(err);
                    }

                    promisedRequest(app)
                        .get('/api/data_sources/' + dataSourceId + '?token=' + token)
                        .expect('content-type', /json/)
                        .expect(404)
                        .then(function () {
                            return promisedRequest(app)
                                .get('/api/records/' + recordId + '?token=' + token)
                                .expect('content-type', /json/)
                                .expect(404);
                        }).then(function () {
                            done();
                        });
                });
        });
    });
});