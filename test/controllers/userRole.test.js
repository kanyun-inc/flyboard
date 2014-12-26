'use strict';

var app = require('../../src/app');
var request = require('supertest');
var User = require('../../src/logicals/user');
var Role = require('../../src/logicals/role');
var UserRole = require('../../src/logicals/userRole');
var Project = require('../../src/logicals/project');
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');
var tokenGenerator = require('../../src/controllers/tokenGenerator');

describe('user_role controller', function(){
    var userIds = null;
    var roleId = null;
    var projectId = null;
    var userRoleId = null;
    var token = null;

    before(function (done) {
        Promise.all([
            User.save({
                email: 'abc@abc.com'
            }),
            User.save({
                email: 'ab@ab.com'
            })
        ]).then(function (ids) {
            userIds = ids;
            return User.get(ids[0]);
        }).then(function (user) {
            token = tokenGenerator.generate(user);
            return Role.save({
                name: 'member',
                scope: 1
            });
        }).then(function (id) {
            roleId = id;
            return Project.save({
                name: 'test'
            });
        }).then(function (id){
            projectId = id;
            done();
        }).catch(done);
    });

    after(function (done) {
        Promise.all([
            knex('users').del(),
            knex('roles').del(),
            knex('projects').del(),
            knex('user_roles').del()
        ]).then(function () {
            done();
        }).catch(done);
    });

    describe('GET /api/user_roles', function(){
        it('should return user_role list', function(done){
            request(app)
                .get('/api/user_roles' + '?token=' + token)
                .expect('content-type', /json/)
                .expect(200, '[]', done);
        });
    });

    describe('POST /api/user_roles', function(){
        it('should create a user_role', function(done){
            request(app)
                .post('/api/user_roles' + '?token=' + token)
                .send({
                    user_id: userIds[0],
                    role_id: roleId,
                    project_id: projectId
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(function(err, res){
                    if(err){
                        return done(err);
                    }
                    userRoleId = res.body.id;
                    done();
                });
        });

        it('should return 400 if data is invalid', function (done) {
            request(app)
                .post('/api/user_roles' + '?token=' + token)
                .send({
                    user_id: userIds[0],
                    role_id: roleId,
                    projectId: -1
                })
                .expect(400)
                .end(done);
        });
    });

    describe('GET /api/user_roles', function(){
       it('should return user_role list', function(done){
           request(app)
               .get('/api/user_roles' + '?token=' + token)
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

    describe('GET /api/user_roles?user_id=?', function(){
       it('should return user_role list for user_id', function(done){
           request(app)
               .post('/api/user_roles' + '?token=' + token)
               .send({
                   user_id: userIds[1],
                   role_id: roleId,
                   project_id: projectId
               })
               .expect(200)
               .expect('content-type', /json/)
               .end(function(err, res){
                   if(err){
                       return done(err);
                   }

                   request(app)
                      .get('/api/user_roles' + '?user_id=' + userIds[1] + '&token=' + token)
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
    });

    describe('GET /api/user_roles/:id', function(){
        it('should return a user_role object', function(done){
            request(app)
                .get('/api/user_roles/' + userRoleId + '?token=' + token)
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT /api/user_roles/:id', function (){
        it('should update a user_role', function (done){
            request(app)
                .put('/api/user_roles/' + userRoleId + '?token=' + token)
                .send({
                    user_id: userIds[0],
                    role_id: roleId,
                    project_id: 0
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(done);
        });

        it('should return 400 if data is invalid', function (done) {
            request(app)
                .put('/api/user_roles/' + userRoleId + '?token=' + token)
                .send({
                    user_id: userIds[0],
                    role_id: roleId,
                    project_id: -1
                })
                .expect(404)
                .end(done);
        });
    });

    describe('DELETE /api/user_roles/:id', function(){
        it('should delete a user_role', function(done){
            request(app)
                .delete('/api/user_roles/' + userRoleId + '?token=' + token)
                .expect(200)
                .end(function(err){
                    if(err){
                        return done(err);
                    }

                    request(app)
                        .get('/api/user_roles/' + userRoleId + '?token=' + token)
                        .expect('content-type', /json/)
                        .expect(404, done);
                });
        });
    });
});
