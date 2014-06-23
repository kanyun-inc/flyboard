'use strict';

var mysql = require('mysql');
var q = require('q');
var fs = require('fs');
var util = require('util');

var config = {};
if (fs.existsSync('../configs/mysql.js')) {
    var env = process.env.NODE_ENV || 'development';
    config = require('../configs/mysql')[env];
} else {
    util.error('Please copy configs/mysql.sample.js to configs/mysql.js and add correct configurations.');
    if (!process.env.UNIT_TEST) {
        process.exit(1);
    }
}

var pool = mysql.createPool(config);

module.exports = {
    query: function () {
        var defer = q.defer();

        var args = Array.prototype.slice.call(arguments);
        args.push(function (err, rows) {
            if (err) {
                defer.reject(err);
                return;
            }

            defer.resolve(rows);
        });

        pool.query.apply(pool, args);

        return defer.promise;
    }
};
