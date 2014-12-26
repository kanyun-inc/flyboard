'use strict';

var tokenGenerator = require('./tokenGenerator');

module.exports = function (req, res, next){
    var token = req.param('token', null);

    // convert token to req.user
    if(token){
        req.user = tokenGenerator.resolve(token);
    }

    next();
};