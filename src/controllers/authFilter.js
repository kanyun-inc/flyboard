'use strict';

var blueBird = require('bluebird');
var User = require('../logicals/user');

module.exports = function (req, res, next) {
    if(req.user) {
        //api request
        if (req.url.indexOf('/api') === 0) {
            var decodeUser = req.user;

            //check salt
            blueBird.resolve(User.get(decodeUser.id)).then(function (user) {
                if (user && decodeUser.id === user.id && decodeUser.id && decodeUser.salt === user.salt) {
                    return next();
                }

                return res.send(403);
            });
        }
        else{
            return next();
        }
    }
    else{
        //api request without token
        if (req.url.indexOf('/api') === 0) {
            return res.send(403);
        }
        //not log in
        else {
            return res.redirect('/login?redirect=' + encodeURIComponent(req.url));
        }
    }
};
