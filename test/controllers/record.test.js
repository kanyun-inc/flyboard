'use strict';

var app = require('../../src/app');
var request = require('supertest');

describe('record controller', function(){
    var RecordId = null;
    var ProjectUuid = null;
    var Key = null;
    var DataSourceId = null;

    describe('POST /api/projects/:uuid/data_sources/:key', function (){
        it('should create a record', function (done){
            request(app)
                .post('/api/projects')
                .send({
                    name: 'apt'
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(function (err, res){
                    if(err){
                        return done(err);
                    }
                    ProjectUuid = res.body.uuid;

                    var projectId = res.body.id;
                    request(app)
                        .post('/api/data_sources')
                        .send({
                            project_id: projectId,
                            name: '登录时间',
                            key: 'loginTIme'
                        })
                        .expect(200)
                        .expect('content-type', /json/)
                        .end(function(err, res){
                            if(err){
                                return done(err);
                            }
                            Key = res.body.key;
                            DataSourceId = res.body.id;

                            request(app)
                                .post('/api/projects/' + ProjectUuid + '/data_sources/' + Key)
                                .send({
                                    value: 100
                                })
                                .expect(200)
                                .expect('content-type', /json/)
                                .end(function(err, res){
                                    if(err){
                                        return done(err);
                                    }

                                    RecordId = res.body.id;
                                    done();
                                });
                        });
                });
        });
    });

    describe('GET /api/records/:id', function(){
        it('should return a record object', function(done){
            request(app)
                .get('/api/records/' + RecordId)
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('DELETE /api/records/:id', function(){
        it('should remove record', function(done){
            request(app)
                .delete('/api/records/' + RecordId)
                .expect(200)
                .end(function(err){
                    if(err){
                        return done(err);
                    }

                    request(app)
                        .get('/api/records/' + RecordId)
                        .expect('content-type', /json/)
                        .expect(404, done);
                });
        });
    });
});