'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var sessionStore = require('express-mysql-session');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var passport = require('../configs/app').passport;

var dbConnection = require('../configs/database').development.connection;

var app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(favicon());
if (!process.env.UNIT_TEST) {
    if ('development' === app.get('env')) {
        app.use(logger('dev'));
    } else {
        app.use(logger());
    }
}
app.use('/public', express.static(path.join(__dirname, '../public')));

app.use(cookieParser());

var sessionOptions = {
    host: dbConnection.host,
    port: 3306,
    user: dbConnection.user,
    password: dbConnection.password,
    database: dbConnection.database
};
app.use(session({
    key: 'session_cookie_name',
    secret: 'fdsajlzcxv.,amsdfjiljkldafdsa',
    store: new sessionStore(sessionOptions),
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    if (req.url.indexOf('/api') === 0) {
        res.type('json');
    }

    next();
});

app.use(require('./middlewares/staticFile')());
app.use(require('./controllers/auth'));
app.use(require('./controllers/index'));
app.use(require('./controllers/project'));
app.use(require('./controllers/dashboard'));
app.use(require('./controllers/widget'));
app.use(require('./controllers/dataSource'));
app.use(require('./controllers/record'));
app.use(require('./controllers/folder'));
app.use(require('./controllers/error').notFound);
app.use(require('./controllers/error').errorHandler);

module.exports = app;