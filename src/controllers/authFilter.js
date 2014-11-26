'use strict';

var blueBird = require('bluebird');
var User = require('../logicals/user');
var tokenGenerator = require('./tokenGenerator');

module.exports = function (req, res, next) {
    if (req.user) {
        return next();
    }

    //api request
    if (req.url.indexOf('/api') === 0) {
        var token = req.param('token', null);
        if (!token) {
            return res.send(403);
        }

        //check token
        var decodeUser = tokenGenerator.resolve(token);

        blueBird.resolve(User.get(decodeUser.id)).then(function (user) {
            if(!user){
                return res.send(404);
            }

            if (decodeUser.id === user.id && decodeUser.id && decodeUser.salt === user.salt) {
                return next();
            }

            return res.send(403);
        });
    }
    //not log in
    else {
        return res.redirect('/login?redirect=' + encodeURIComponent(req.url));
    }
};