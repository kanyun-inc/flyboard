'use strict';

var app = require('../../src/app');
var request = require('supertest');
var User = require('../../src/logicals/user');
var Role = require('../../src/logicals/role');
var UserRole = require('../../src/logicals/userRole');
var RolePrivilege = require('../../src/logicals/rolePrivilege');
var Promise = require('bluebird');
var promisedRequest = require('supertest-as-promised');
var knex = require('../../src/lib/knex');
var tokenGenerator = require('../../src/controllers/tokenGenerator');

describe('role controller', function(){
    var userId = null;
    var roleId = null;
    var userRoleId = null;
    var token = null;

    before(function (done) {
        User.save({
            email: 'abc@abc.com'
        }).then(function (id) {
            userId = id;
            return User.get(id);
        }).then(function (user) {
            token = tokenGenerator.generate(user);

            return Role.save({
                name: 'admin',
                scope: 2
            });
        }).then(function (id){
            roleId = id;

            return UserRole.save({
                user_id: userId,
                role_id: roleId,
                project_id: 0
            });
        }).then(function (userRole) {
            userRoleId = userRole.id;

            return RolePrivilege.save({
                resource: 'PROJECT',
                operation: 'GET',
                role_id: roleId
            });
        }).then(function (){
            done();
        }).catch(done);
    });

    after(function (done) {
        Promise.all([
            knex('users').del(),
            knex('roles').del(),
            knex('user_roles').del(),
            knex('role_privileges').del()
        ]).then(function () {
            done();
        }).catch(done);
    });

    describe('GET /api/roles', function(){
        it('should return role list', function(done){
            request(app)
                .get('/api/roles' + '?token=' + token)
                .expect('content-type', /json/)
                .expect(200)
                .expect(function (res){
                    if(res.body.length !== 1){
                        throw new Error('ret length invalid');
                    }
                }).end(done);
        });
    });

    describe('POST /api/roles', function(){
        it('should create a role', function(done){
            request(app)
                .post('/api/roles' + '?token=' + token)
                .send({
                    name: 'member',
                    scope: 1
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
                .post('/api/roles' + '?token=' + token)
                .send({
                    name: null
                })
                .expect(400)
                .end(done);
        });
    });

    describe('GET /api/roles', function(){
       it('should return role list', function(done){
           request(app)
               .get('/api/roles' + '?token=' + token)
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

    describe('GET /api/roles/:id', function(){
        it('should return a role object', function(done){
            request(app)
                .get('/api/roles/' + roleId + '?token=' + token)
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT /api/roles/:id', function (){
        it('should update a role', function (done){
            request(app)
                .put('/api/roles/' + roleId + '?token=' + token)
                .send({
                    name: 'site admin',
                    scope: 2
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(done);
        });

        it('should return 400 if data is invalid', function (done) {
            request(app)
                .put('/api/roles/' + roleId + '?token=' + token)
                .send({
                    name: 'site admin'
                })
                .expect(400)
                .end(done);
        });
    });

    describe('DELETE /api/roles/:id', function(){
        it('should delete a role', function(done){
            request(app)
                .delete('/api/roles/' + roleId + '?token=' + token)
                .expect(200)
                .end(function(err){
                    if(err){
                        return done(err);
                    }

                    promisedRequest(app)
                        .get('/api/roles/' + roleId + '?token=' + token)
                        .expect('content-type', /json/)
                        .expect(404)
                        .then(function () {
                            return promisedRequest(app)
                                .get('/api/user_roles/' + userRoleId + '?token=' + token)
                                .expect('content-type', /json/)
                                .expect(404);
                        }).then(function () {
                            return promisedRequest(app)
                                .get('/api/role_privileges/' + '?role_id=' + roleId + '&token=' + token)
                                .expect('content-type', /json/)
                                .expect(function (res) {
                                    if (res.body.length !== 0) {
                                        throw new Error('invalid length');
                                    }
                                });
                        }).then(function (){
                            done();
                        });
                });
        });
    });
});
