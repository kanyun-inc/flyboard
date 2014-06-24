'use strict';

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');

var app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

app.use(favicon());
if (!process.env.UNIT_TEST) {
    if ('development' === app.get('env')) {
        app.use(logger('dev'));
    } else {
        app.use(logger());
    }
}
app.use('/public', express.static(path.join(__dirname, '../public')));

app.use(function (req, res, next) {
    if (req.url.indexOf('/api') === 0) {
        res.type('json');
    }

    next();
});
app.use(require('./middlewares/staticFile')());
app.use(require('./controllers/index'));
app.use(require('./controllers/project'));
app.use(require('./controllers/error').notFound);
app.use(require('./controllers/error').errorHandler);

module.exports = app;
