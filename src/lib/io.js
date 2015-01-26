'use strict';

var io = null;

exports.init = function (http) {
    io = require('socket.io')(http);

    return io;
};

exports.get = function () {
    if(!io){
        throw new Error('socket.io must be initialized before use');
    }

    return io;
};