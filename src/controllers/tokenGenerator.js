'use strict';

var jwt = require('jwt-simple');
var secret = '134fsaldgfsag.sdfsp';

exports.generate = function (content) {
    return jwt.encode(content, secret);
};

exports.resolve = function (token){
    return jwt.decode(token, secret);
};