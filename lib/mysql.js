var env = process.env.NODE_ENV || 'development';

var config = require('../configs/mysql')[env];
var mysql = require('mysql');
var q = require('q');

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

        return defer.promise;
    }
};
