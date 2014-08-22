'use strict';

var app = require('../../src/app');
var request = require('supertest');
var DataSource = require('../../src/logicals/dataSource');
var Project = require('../../src/logicals/project');
var Record = require('../../src/logicals/record');
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');

describe('record controller', function(){
    var projectId = null;
    var dataSourceId = null;
    var recordId = null;
    var projectUuid = null;
    var key = null;

    before(function (done) {
        Project
            .save({name: 'ape'})
            .then(function (id) {
                projectId = id;

                return Project.get(projectId)
                    .then(function (project) {
                    projectUuid = project.uuid;

                    return DataSource.save({
                        name: 'loginUser',
                        key: 'loginUser',
                        project_id: projectId
                    });
                });
            })
            .then(function (id) {
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
                                day: 28
                            }),
                            Record.save({
                                data_source_id: dataSourceId,
                                value: 99,
                                year: 2014,
                                month: 6,
                                day: 29
                            }),
                            Record.save({
                                data_source_id: dataSourceId,
                                value: 100,
                                year: 2014,
                                month: 6,
                                day: 30
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
                .post('/api/projects/' + projectUuid + '/data_sources/' + key)
                .send({
                    value: 100
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
                .get('/api/records/' + recordId)
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });
    describe('GET /api/data_sources/:id/records', function(){
        it('should return limit numbers of record', function (done){
            request(app)
                .get('/api/data_sources/' + dataSourceId + '/records?limit=4')
                .expect(200)
                .expect('content-type', /json/)
                .end(done);
        });

        it('should return  record list', function (done){
            request(app)
                .get('/api/data_sources/' + dataSourceId + '/records')
                .expect(200)
                .expect('content-type', /json/)
                .end(done);
        });
    });

    describe('DELETE /api/records/:id', function(){
        it('should remove record', function(done){
            request(app)
                .delete('/api/records/' + recordId)
                .expect(200)
                .end(function(err){
                    if(err){
                        return done(err);
                    }

                    request(app)
                        .get('/api/records/' + recordId)
                        .expect('content-type', /json/)
                        .expect(404, done);
                });
        });
    });
});