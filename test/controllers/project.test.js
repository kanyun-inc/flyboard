'use strict';

var app = require('../../src/app');
var request = require('supertest');

describe('project controller', function () {
    var projectId = null;

    describe('GET /api/projects', function () {
        it('should return project list', function (done) {
            request(app)
                .get('/api/projects')
                .expect('content-type', /json/)
                .expect(200, '[]', done);
        });
    });

    describe('POST /api/projects', function () {
        it('should create a project', function (done) {
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
                    done();
                });
        });
    });

    describe('GET /api/projects', function () {
        it('should return project list', function (done) {
            request(app)
                .get('/api/projects')
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('GET /api/projects/:id', function () {
        it('should return a project object', function (done) {
            request(app)
                .get('/api/projects/' + projectId)
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT /api/projects/:id', function(){
        it('should update a project', function(done){
            request(app)
                .put('/api/projects/' + projectId)
                .send({
                    name: 'apt'
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

    describe('DELETE /api/projects/:id', function () {
        it('should remove project', function (done) {
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
