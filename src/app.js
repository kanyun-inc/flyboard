'use strict';

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');

var app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../public')));

app.use(require('./controllers/indexController'));
app.use(require('./controllers/errorController').notFound);
app.use(require('./controllers/errorController').errorHandler);

module.exports = app;
