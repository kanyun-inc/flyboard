'use strict';

var app = require('../../src/app');
var request = require('supertest');
<<<<<<< HEAD
var assert = require('chai').assert;
var DataSource = require('../../src/logicals/dataSource');
var Project = require('../../src/logicals/project');
var Record = require('../../src/logicals/record');
var Promise = require('bluebird');
var knex = require('../../src/lib/knex');
=======
>>>>>>> FETCH_HEAD

describe('dataSource controller', function(){
    var projectId = null;
    var dataSourceId = null;

<<<<<<< HEAD
    before(function (done) {
        Project
            .save({name: 'ape'})
            .then(function (id) {
                projectId = id;

                return DataSource.save({
                    name: 'loginUser',
                    key: 'loginUser',
                    project_id: id
                });
            })
            .then(function (id) {
                dataSourceId = id;

                return Promise.all([
                    Record.save({
                        data_source_id: id,
                        value: 98,
                        year: 2014,
                        month: 6,
                        day: 28
                    }),
                    Record.save({
                        data_source_id: id,
                        value: 99,
                        year: 2014,
                        month: 6,
                        day: 29
                    }),
                    Record.save({
                        data_source_id: id,
                        value: 100,
                        year: 2014,
                        month: 6,
                        day: 30
                    })
                ]);
            }).then(function () {
                done();
            }).catch(done);
    });

    after(function (done) {
        return Promise.all([
            knex('records').del(),
            knex('data_sources').del(),
            knex('projects').del()
        ]).then(function () {
            done();
        }).catch(done);
    });

    describe.skip('GET /api/data_sources', function(){
=======
    describe('GET /api/data_sources', function(){
>>>>>>> FETCH_HEAD
        it('should return dataSource list', function(done){
            request(app)
                .get('/api/data_sources')
                .expect('content-type', /json/)
                .expect(200, '[]', done);
        });
    });

    describe('POST /api/data_sources', function(){
        it('should create a dataSource', function (done){
            request(app)
<<<<<<< HEAD
                .post('/api/data_sources')
                .send({
                    project_id: projectId,
                    name: '登录时间',
                    key: 'loginTime'
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(done);
=======
                .post('/api/projects')
                .send({
                    name: 'apt'
                })
                .expect(200)
                .expect('content-type', /json/)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    projectId = res.body.id;

                    request(app)
                        .post('/api/data_sources')
                        .send({
                            project_id: projectId,
                            name: '登录时间',
                            key: 'loginTime'
                        })
                        .expect(200)
                        .expect('content-type', /json/)
                        .end(function (err, res) {
                            if(err){
                                return done(err);
                            }
                            dataSourceId = res.body.id;
                            done();
                        });
                });
>>>>>>> FETCH_HEAD
        });
    });

    describe('GET /api/data_sources', function (){
        it('should return dataSource list', function(done){
            request(app)
                .get('/api/data_sources')
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('GET /api/data_sources/:id', function (){
        it('should return a dataSource', function(done){
            request(app)
                .get('/api/data_sources/' + dataSourceId)
                .expect('content-type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT /api/data_sources/:id', function () {
        it('should update a dataSource', function(done){
            request(app)
                .put('/api/data_sources/' + dataSourceId)
                .send({
                    name: 'loginDate'
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

<<<<<<< HEAD
    describe('GET /api/data_sources/:id/records', function(){
        it('should return limit numbers of record', function (done){
            request(app)
                .get('/api/data_sources/' + dataSourceId + '/records?limit=4')
                .expect(200)
                .expect('content-type', /json/)
                .end(function(err, res) {
                    if(err){
                        return done(err);
                    }
                    done();
                });
        });

        it('should return  record list', function (done){
            request(app)
                .get('/api/data_sources/' + dataSourceId + '/records')
                .expect(200)
                .expect('content-type', /json/)
                .end(function(err, res) {
                    if(err){
                        return done(err);
                    }
                    done();
                });
        });
    });

=======
>>>>>>> FETCH_HEAD
    describe('DELETE /api/data_sources/:id', function (){
        it('should delete a dataSource', function(done){
            request(app)
                .delete('/api/data_sources/' + dataSourceId)
                .expect(200)
                .end(function (err){
                    if(err){
                        return done(err);
                    }

                    request(app)
                        .get('/api/data_sources/' + dataSourceId)
                        .expect('content-type', /json/)
                        .expect(404);
                });
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