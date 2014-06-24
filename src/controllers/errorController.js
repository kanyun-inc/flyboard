/*jshint unused: false, maxparams: 4*/

'use strict';

exports.notFound = function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
};

exports.errorHandler = function (err, req, res, next) {
    res.status(err.status || 500);

    if (req.url.indexOf('/api') === 0) {
        res.send({
            message: err.message,
            error: err
        });
    } else {
        res.render('error', {
            message: err.message,
            error: err
        });
    }
};
