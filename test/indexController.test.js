'use strict';

var request = require('supertest');
var app = require('../src/app');

describe('GET /', function () {
    it('respond with 200', function (done) {
        request(app)
            .get('/')
            .expect(200, done);
    });
});
