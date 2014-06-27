'use strict';

var app = require('../../src/app');
var request = require('supertest');

describe('dataSource controller', function(){
    var projectId = null;
    var dataSourceId = null;

    describe('GET /api/data_sources', function(){
        it('should return dataSource list', function(done){
            request(app)
                .get('/api/data_sources')
                .expect('content-type', /json/)
                .expect(200, '[]', done);
        });
    });

    describe('POST /api/data_sources', function(){
        it('should create a dataSource', function (done){
            request(app)
                .post('/api/projects')
                .send({
                    name: 'apt'
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    projectId = res.body.id;

                    request(app)
                        .post('/api/data_sources')
                        .send({
                            project_id: projectId,
                            name: '登录时间',
                            key: 'loginTime'
                        })
                        .expect(200)
                        .expect('content-type', /json/)
                        .end(function (err, res) {
                            if(err){
                                return done(err);
                            }
                            dataSourceId = res.body.id;
                            done();
                        });
                });
        });
    });

    describe('GET /api/data_sources', function (){
        it('should return dataSource list', function(done){
            request(app)
                .get('/api/data_sources')
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('GET /api/data_sources/:id', function (){
        it('should return a dataSource', function(done){
            request(app)
                .get('/api/data_sources/' + dataSourceId)
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT /api/data_sources/:id', function () {
        it('should update a dataSource', function(done){
            request(app)
                .put('/api/data_sources/' + dataSourceId)
                .send({
                    name: 'loginDate'
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

    describe('DELETE /api/data_sources/:id', function (){
        it('should delete a dataSource', function(done){
            request(app)
                .delete('/api/data_sources/' + dataSourceId)
                .expect(200)
                .end(function (err){
                    if(err){
                        return done(err);
                    }

                    request(app)
                        .get('/api/data_sources/' + dataSourceId)
                        .expect('content-type', /json/)
                        .expect(404);
                });
            request(app)
                .delete('/api/projects/' + projectId)
                .expect(200)
                .end(function (err) {
                    if (err) {
                        return done(err);
                    }

                    request(app)
                        .get('/api/projects/' + projectId)
                        .expect('content-type', /json/)
                        .expect(404, done);
                });
        });
    });
});