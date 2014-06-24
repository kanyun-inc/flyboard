'use strict';

process.env.UNIT_TEST = true;

var request = require('supertest');
var app = require('../../src/app');

describe('GET /404', function () {
    it('respond with 404', function (done) {
        request(app)
            .get('/404')
            .expect(404, done);
    });
});
