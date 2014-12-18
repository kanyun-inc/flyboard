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

describe('dashboard controller', function(){
    var userId = null;
    var roleId = null;
    var projectId = null;
    var dashboardId = null;
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
        }).then(function (id) {
            roleId = id;

            return UserRole.save({
                user_id: userId,
                role_id: roleId,
                project_id: 0
            });
        }).then(function (){
            return Project.save({
                name: 'ape'
            });
        }).then(function (id) {
            projectId = id;
            done();
        }).catch(done);
    });

    after(function (done) {
        return Promise.all([
            knex('users').del(),
            knex('roles').del(),
            knex('user_role').del(),
            knex('dashboards').del(),
            knex('projects').del()
        ]).then(function () {
            done();
        }).catch(done);
    });

    describe('GET /api/dashboards', function(){
        it('should return dashboard list', function(done){
            request(app)
                .get('/api/dashboards' + '?project_id=' + projectId + '&token=' + token)
                .expect('content-type', /json/)
                .expect(200, '[]', done);
        });
    });

    describe('POST /api/dashboards', function(){
        it('should create a dashboard', function(done){
            request(app)
                .post('/api/dashboards' + '?token=' + token)
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
                    done();
                });
        });
    });

    describe('GET /api/dashboards', function(){
       it('should return dashboard list', function(done){
           request(app)
               .get('/api/dashboards' + '?project_id=' + projectId + '&token=' + token)
               .expect('content-type', /json/)
               .expect(200, done);
       });
    });

    describe('GET /api/dashboards/:id', function(){
        it('should return a dashboard object', function(done){
            request(app)
                .get('/api/dashboards/' + dashboardId + '?token=' + token)
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT /api/dashboards/:id', function (){
        it('should update a dashboard', function (done){
            request(app)
                .put('/api/dashboards/' + dashboardId + '?token=' + token)
                .send({
                    name: 'apt',
                    project_id: projectId,
                    config: {
                        layout:[
                            {'id':3,'first_grid':[0,0],'last_grid':[1,1]}
                        ]
                    }
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(done);
        });

        it('should update config of dashboard', function (done) {
            request(app)
                .put('/api/dashboards/' + dashboardId + '?token=' + token)
                .send({
                    name: 'apt',
                    project_id: projectId,
                    config: {
                        layout:[
                            {'id':3,'first_grid':[0,0],'last_grid':[1,1]},
                            {'id':465,'first_grid':[4,0],'last_grid':[8,5]}
                        ]
                    }
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(done);
        });

        it('should return 400 if data is invalid', function (done) {
            request(app)
                .put('/api/dashboards/' + dashboardId + '?token=' + token)
                .send({
                    name: null
                })
                .expect(400)
                .end(done);
        });
    });

    describe('DELETE /api/dashboards/:id', function(){
        it('should delete a dashboard', function(done){
            request(app)
                .delete('/api/dashboards/' + dashboardId + '?token=' + token)
                .expect(200)
                .end(function(err){
                    if(err){
                        return done(err);
                    }

                    request(app)
                        .get('/api/dashboards/' + dashboardId + '?token=' + token)
                        .expect('content-type', /json/)
                        .expect(404, done);
                });
        });
    });
});
