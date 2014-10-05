'use strict';

var app = require('../../src/app');
var request = require('supertest');

describe('widget controller', function(){
    var projectId = null;
    var dashboardId = null;
    var widgetId = null;

    describe('GET /api/dashboards/:dashboardId/widgets', function(){
        it('should return widget list', function(done){
            request(app)
                .post('/api/projects')
                .send({
                    name: 'ape'
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    projectId = res.body.id;

                    request(app)
                        .post('/api/dashboards')
                        .send({
                            name: 'users',
                            project_id: projectId
                        })
                        .expect(200)
                        .expect('content-type', /json/)
                        .end(function(err, res){
                            if(err){
                                return done(err);
                            }
                            dashboardId = res.body.id;

                            request(app)
                                .get('/api/dashboards/' + dashboardId + '/widgets')
                                .expect('content-type', /json/)
                                .expect(200, '[]', done);
                        });
                });
        });
    });

    describe('POST /api/dashboards/:dashboardId/widgets', function(){
        it('should create a widget', function(done){
            request(app)
                .post('/api/dashboards/' + dashboardId + '/widgets')
                .send({
                    type: 1,
                    config: {size: 10},
                    dashboard_id: dashboardId
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(function(err, res){
                    if(err){
                        return done(err);
                    }
                    widgetId = res.body.id;
                    done();
                });
        });
    });

    describe('GET /api/dashboards/:dashboardId/widgets', function(){
        it('should return widget list', function(done){
            request(app)
                .get('/api/dashboards/' + dashboardId + '/widgets')
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('GET /api/dashboards/:dashboardId/widgets/:id', function(){
        it('should return a widget', function(done){
            request(app)
                .get('/api/dashboards/' + dashboardId + '/widgets/' + widgetId)
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT /api/dashboards/:dashboardId/widgets/:id', function(){
        it('should update a widget', function(done){
            request(app)
                .put('/api/dashboards/' + dashboardId + '/widgets/' + widgetId)
                .send({
                    type: 2
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(function(err, res){
                    if(err){
                        return done(err);
                    }
                    done();
                })
        });
    })

    describe('DELETE /api/dashboards/:dashboardId/widgets/:id', function(){
        it('should delete a widget', function(done){
            request(app)
                .delete('/api/dashboards/' + dashboardId + '/widgets/' + widgetId)
                .expect(200)
                .end(function (err) {
                    if(err){
                        return done(err);
                    }

                    request(app)
                        .get('/api/dashboards/' + dashboardId + '/widgets/' + widgetId)
                        .expect('content-type', /json/)
                        .expect(404);
                });

            request(app)
                .delete('/api/dashboards/' + dashboardId)
                .expect(200)
                .end(function(err){
                    if(err){
                        return done(err);
                    }

                    request(app)
                        .get('/api/dashboards/' + dashboardId)
                        .expect('content-type', /json/)
                        .expect(404, done);
                });
        });
    })
});