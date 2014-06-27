'use strict';

var app = require('../../src/app');
var request = require('supertest');

describe('record controller', function(){
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
                                .end(done);
                        });
                });
        });
    });
});