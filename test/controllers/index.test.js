'use strict';

process.env.UNIT_TEST = true;

var request = require('supertest');
var app = require('../../src/app');

describe('GET /', function () {
    it('respond with 200', function (done) {
        request(app)
            .get('/')
            .expect(200, done);
    });
});

describe('GET /stat', function () {
    it('respond with 200', function (done) {
        request(app)
            .get('/stat')
            .expect(200, done);
    });
});