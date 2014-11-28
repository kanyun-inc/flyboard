'use strict';

var tokenGenerator = require('./tokenGenerator');

module.exports = function (req, res, next){
    var token = req.param('token', null);

    if(token){
        req.user = tokenGenerator.resolve(token);
    }

    next();
};