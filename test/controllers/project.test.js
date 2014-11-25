'use strict';

var app = require('../../src/app');
var request = require('supertest');
var User = require('../../src/logicals/user');
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');
var tokenGenerator = require('../../src/controllers/tokenGenerator');

describe('project controller', function () {
    var userId = null;
    var projectId = null;
    var token = null;

    before(function (done) {
        User.save({
            email: 'abc@abc.com',
            salt: 'sfsafiwer'
        }).then(function (id) {
            userId = id;
            return User.get(id);
        }).then(function (user) {
            token = tokenGenerator.generate(user);
            done();
        }).catch(done);
    });

    after(function (done) {
        return Promise.all([
            knex('users').del(),
            knex('projects').del()
        ]).then(function () {
            done();
        }).catch(done);
    });

    describe('GET /api/projects', function () {
        it('should return project list', function (done) {
            request(app)
                .get('/api/projects' + '?token=' + token)
                .expect('content-type', /json/)
                .expect(200, '[]', done);
        });
    });

    describe('POST /api/projects', function () {
        it('should create a project', function (done) {
            request(app)
                .post('/api/projects' + '?token=' + token)
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
                .get('/api/projects' + '?token=' + token)
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('GET /api/projects/:id', function () {
        it('should return a project object', function (done) {
            request(app)
                .get('/api/projects/' + projectId + '?token=' + token)
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT /api/projects/:id', function (){
        it('should update a project', function (done){
            request(app)
                .put('/api/projects/' + projectId + '?token=' + token)
                .send({
                    name: 'apt'
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(done);
        });
    });

    describe('DELETE /api/projects/:id', function () {
        it('should remove project', function (done) {
            request(app)
                .delete('/api/projects/' + projectId + '?token=' + token)
                .expect(200)
                .end(function (err) {
                    if (err) {
                        return done(err);
                    }

                    request(app)
                        .get('/api/projects/' + projectId + '?token=' + token)
                        .expect('content-type', /json/)
                        .expect(404, done);
                });
        });
    });
});
