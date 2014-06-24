'use strict';

var Promise = require('bluebird');
var fs = require('fs');
var crypto = require('crypto');
var path = require('path');

var readFile = Promise.promisify(fs.readFile);
exports.url = function (file) {
    return readFile(path.join(__dirname, '../../public', file), 'utf-8').then(function (content) {
        var shasum = crypto.createHash('sha1');
        shasum.update(content);
        return '/public/' + file + '?' + shasum.digest('hex');
    });
};
