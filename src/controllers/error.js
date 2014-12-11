/*jshint unused: false, maxparams: 4*/

'use strict';

exports.notFound = function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
};

exports.errorHandler = function (err, req, res, next) {
    res.status(err.status || 500);

    if (process.env.UNIT_TEST && err.status !== 404) {
        console.error(err.stack || err);
    }

    if (req.url.indexOf('/api') === 0) {
        console.error(err.sack);
        return res.send({
            message: err.message,
            error: err
        });
    } else if (err.status === 403) {
        req.session.destroy();
        res.redirect('/login?redirect=' + encodeURIComponent(req.url));
    } else {
        res.render('error', {
            message: err.message,
            error: err
        });
    }
};
