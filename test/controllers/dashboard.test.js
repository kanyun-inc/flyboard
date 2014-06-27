'use strict';

var app = require('../../src/app');
var request = require('supertest');

describe('dashboard controller', function(){
    var dashboardId = null;

    describe('GET /api/dashboards', function(){
        it('should return dashboard list', function(done){
            request(app)
                .get('/api/dashboards')
                .expect('content-type', /json/)
                .expect(200, '[]', done);
        });
    });

    describe('POST /api/dashboards', function(){
        it('should create a dashboard', function(done){
            request(app)
                .post('/api/dashboards')
                .send({
                    name: 'users'
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(function(err, res){
                    if(err){
                        return done(err);
                    }
                    dashboardId = res.body.id;
                    done();
                })
        });
    });

    describe('GET /api/dashboards', function(){
       it('should return dashboard list', function(done){
           request(app)
               .get('/api/dashboards')
               .expect('content-type', /json/)
               .expect(200, done);
       });
    });

    describe('GET /api/dashboards/:id', function(){
        it('should return a dashboard object', function(done){
            request(app)
                .get('/api/dashboards/' + dashboardId)
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT /api/dashboards/:id', function(){
        it('should update a dashboard', function(done){
            request(app)
                .put('/api/dashboards/' + dashboardId)
                .send({
                    name: "apt"
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

    describe('DELETE /api/dashboards/:id', function(){
        it('should delete a dashboard', function(done){
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
    });
});
