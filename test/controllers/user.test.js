'use strict';

var app = require('../../src/app');
var request = require('supertest');
var User = require('../../src/logicals/user');
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');
var tokenGenerator = require('../../src/controllers/tokenGenerator');

describe('user controller', function(){
    var userId = null;
    var token = null;

    before(function (done) {
        User.save({
            email: 'abc@abc.com'
        }).then(function (id) {
            userId = id;
            return User.get(id);
        }).then(function (user) {
            token = tokenGenerator.generate(user);
            done();
        }).catch(done);
    });

    after(function (done) {
        return knex('users')
            .del()
            .then(function () {
                done();
            }).catch(done);
    });

    describe('GET /api/users', function(){
        it('should return user list', function(done){
            request(app)
                .get('/api/users' + '?token=' + token)
                .expect('content-type', /json/)
                .expect(200)
                .expect(function (res){
                    if(res.body.length !== 1){
                        throw new Error('ret length invalid');
                    }
                })
                .end(done);
        });
    });

    describe('POST /api/users', function(){
        it('should create a user', function(done){
            request(app)
                .post('/api/users' + '?token=' + token)
                .send({
                    email: 'ab@ab.com'
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

        it('should return 400 if data is invalid', function (done) {
            request(app)
                .post('/api/users' + '?token=' + token)
                .send({
                    email: null
                })
                .expect(400)
                .end(done);
        });
    });

    describe('GET /api/users', function(){
       it('should return user list', function(done){
           request(app)
               .get('/api/users' + '?token=' + token)
               .expect('content-type', /json/)
               .expect(200)
               .expect(function (res){
                   if(res.body.length !== 2){
                       throw new Error('ret length invalid');
                   }
               })
               .end(done);
       });
    });

    describe('GET /api/users/:id', function(){
        it('should return a user object', function(done){
            request(app)
                .get('/api/users/' + userId + '?token=' + token)
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT /api/users/:id', function (){
        it('should update a user', function (done){
            request(app)
                .put('/api/users/' + userId + '?token=' + token)
                .send({
                    email: 'apt@apt.com'
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(done);
        });

        it('should return 400 if data is invalid', function (done) {
            request(app)
                .put('/api/users/' + userId + '?token=' + token)
                .send({
                    email: null
                })
                .expect(400)
                .end(done);
        });
    });

    describe('DELETE /api/users/:id', function(){
        it('should delete a user', function(done){
            request(app)
                .delete('/api/users/' + userId + '?token=' + token)
                .expect(200)
                .end(function(err){
                    if(err){
                        return done(err);
                    }

                    request(app)
                        .get('/api/users/' + userId + '?token=' + token)
                        .expect('content-type', /json/)
                        .expect(404, done);
                });
        });
    });
});
