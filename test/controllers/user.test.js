'use strict';

var app = require('../../src/app');
var request = require('supertest');
var User = require('../../src/logicals/user');
var Role = require('../../src/logicals/role');
var UserRole = require('../../src/logicals/userRole');
var Promise = require('bluebird');
var promisedRequest = require('supertest-as-promised');
var knex = require('../../src/lib/knex');
var tokenGenerator = require('../../src/controllers/tokenGenerator');

describe('user controller', function(){
    var userIds = [];
    var roleId = null;
    var userRoleId = null;
    var tokens = [];

    before(function (done) {
        Promise.all([
            User.save({
                email: 'abc@abc.com'
            }),
            User.save({
                email: 'ab@ab.com'
            })
        ]).then(function (ret){
            userIds = ret;

            return Promise.all([
                User.get(userIds[0]),
                User.get(userIds[1])
            ]);
        }).then(function (users) {
            tokens = users.map(function (user) {
                return tokenGenerator.generate(user);
            });

            return Role.save({
                name: 'admin',
                scope: 2
            });
        }).then(function (id){
            roleId = id;

            return UserRole.save({
                user_id: userIds[0],
                role_id: roleId,
                project_id: 0
            });
        }).then(function (id){
            userRoleId = id;

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
                .get('/api/users' + '?token=' + tokens[0])
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

    describe('POST /api/users', function(){
        it('should create a user', function(done){
            request(app)
                .post('/api/users' + '?token=' + tokens[0])
                .send({
                    email: 'abz@abz.com'
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
                .post('/api/users' + '?token=' + tokens[0])
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
               .get('/api/users' + '?token=' + tokens[0])
               .expect('content-type', /json/)
               .expect(200)
               .expect(function (res){
                   if(res.body.length !== 3){
                       throw new Error('ret length invalid');
                   }
               })
               .end(done);
       });
    });

    describe('GET /api/users/:id', function(){
        it('should return a user object', function(done){
            request(app)
                .get('/api/users/' + userIds[0] + '?token=' + tokens[0])
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('GET /api/users/current', function(){
        it('should return current user', function(done){
            request(app)
                .get('/api/users/current' + '?token=' + tokens[0])
                .expect('content-type', /json/)
                .expect(200)
                .expect(function (res){
                    if(res.body.email !== 'abc@abc.com'){
                        throw new Error('wrong user');
                    }
                })
                .end(done);
        });
    });

    describe('GET /api/users/token/:id', function(){
        it('should return user token', function(done){
            request(app)
                .get('/api/users/token/' + userIds[1] + '?token=' + tokens[0])
                .expect('content-type', /json/)
                .expect(200)
                .expect(function (res){
                    var userObj = tokenGenerator.resolve(res.body.token);

                    if(userObj.id !== userIds[1]){
                        throw new Error('invalid token');
                    }
                })
                .end(done);
        });
    });

    describe('PUT /api/users/:id', function (){
        it('should update a user', function (done){
            request(app)
                .put('/api/users/' + userIds[0] + '?token=' + tokens[0])
                .send({
                    email: 'apt@apt.com'
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(done);
        });

        it('should return 400 if data is invalid', function (done) {
            request(app)
                .put('/api/users/' + userIds[0] + '?token=' + tokens[0])
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
                .delete('/api/users/' + userIds[0] + '?token=' + tokens[0])
                .expect(200)
                .end(function(err){
                    if(err){
                        return done(err);
                    }

                    promisedRequest(app)
                        .get('/api/users/' + userIds[0] + '?token=' + tokens[0])
                        .expect('content-type', /json/)
                        .expect(404)
                        .then(function (){
                            return promisedRequest(app)
                                .get('/api/user_roles/' + userRoleId + '?token=' + tokens[0])
                                .expect('content-type', /json/)
                                .expect(404);
                        }).then(function (){
                            done();
                        });
                });
        });
    });
});
