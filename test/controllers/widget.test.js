'use strict';

var app = require('../../src/app');
var request = require('supertest');
var User = require('../../src/logicals/user');
var Role = require('../../src/logicals/role');
var UserRole = require('../../src/logicals/userRole');
var Project = require('../../src/logicals/project');
var Dashboard = require('../../src/logicals/dashboard');
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');
var tokenGenerator = require('../../src/controllers/tokenGenerator');

describe('widget controller', function(){
    var userId = null;
    var roleId = null;
    var projectId = null;
    var dashboardId = null;
    var widgetId = null;
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
            return Dashboard.save({
                name: 'users',
                project_id: projectId
            });
        }).then(function (id){
            dashboardId = id;
            done();
        }).catch(done);
    });

    after(function (done) {
        return Promise.all([
            knex('users').del(),
            knex('projects').del(),
            knex('dashboards').del(),
            knex('widgets').del()
        ]).then(function () {
            done();
        }).catch(done);
    });

    describe('GET /api/dashboards/:dashboardId/widgets', function(){
        it('should return widget list', function(done){
            request(app)
                .get('/api/dashboards/' + dashboardId + '/widgets' + '?token=' + token)
                .expect('content-type', /json/)
                .expect(200, '[]', done);
        });
    });

    describe('POST /api/dashboards/:dashboardId/widgets', function(){
        it('should create a widget', function(done){
            request(app)
                .post('/api/dashboards/' + dashboardId + '/widgets' + '?token=' + token)
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
                .get('/api/dashboards/' + dashboardId + '/widgets' + '?token=' + token)
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('GET /api/dashboards/:dashboardId/widgets/:id', function(){
        it('should return a widget', function(done){
            request(app)
                .get('/api/dashboards/' + dashboardId + '/widgets/' + widgetId + '?token=' + token)
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT /api/dashboards/:dashboardId/widgets/:id', function(){
        it('should update a widget', function(done){
            request(app)
                .put('/api/dashboards/' + dashboardId + '/widgets/' + widgetId + '?token=' + token)
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
                });
        });
    });

    describe('DELETE /api/dashboards/:dashboardId/widgets/:id', function(){
        it('should delete a widget', function(done){
            request(app)
                .delete('/api/dashboards/' + dashboardId + '/widgets/' + widgetId + '?token=' + token)
                .expect(200)
                .end(function (err) {
                    if(err){
                        return done(err);
                    }

                    request(app)
                        .get('/api/dashboards/' + dashboardId + '/widgets/' + widgetId + '?token=' + token)
                        .expect('content-type', /json/)
                        .expect(404, done);
                });
        });
    });
});