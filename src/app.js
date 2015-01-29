'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mysqlStore = require('express-mysql-session');
var SQLiteStore = require('connect-sqlite3')(session);
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var passport = require('../configs/app').passport;
var flash = require('connect-flash');

var dbConfig = require('../configs/database')[process.env.NODE_ENV || 'development'];

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

/* --------- sqlite session ----------- */
if(dbConfig.client === 'sqlite3'){
    app.use(session({
        store: new SQLiteStore (),
        secret: '092r3jsdfkghasdfg.s23rsdfafd',
        cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },  // 1 week
        resave: true,
        saveUninitialized: true
      }));
}
/* --------- mysql session ----------- */
if(dbConfig.clent === 'mysql'){
    var sessionOptions = {
        host: dbConfig.connection.host,
        port: 3306,
        user: dbConfig.connection.user,
        password: dbConfig.connection.password,
        database: dbConfig.connection.database
    };

    app.use(session({
        key: 'session_cookie_name',
        secret: 'fdsajlzcxv.,amsdfjiljkldafdsa',
        store: new mysqlStore(sessionOptions),
        resave: true,
        saveUninitialized: true
    }));
}
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    res.locals.flash = req.flash.bind(req);

    if (req.url.indexOf('/api') === 0) {
        res.type('json');
    }

    next();
});

app.use(require('./middlewares/staticFile')());
app.use(require('./controllers/auth'));
app.use(require('./controllers/notFound'));
app.use(require('./controllers/tokenPreprocess'));
app.use(require('./controllers/project'));
app.use(require('./controllers/dashboard'));
app.use(require('./controllers/widget'));
app.use(require('./controllers/dataSource'));
app.use(require('./controllers/record'));
app.use(require('./controllers/folder'));
app.use(require('./controllers/user'));
app.use(require('./controllers/role'));
app.use(require('./controllers/userRole'));
app.use(require('./controllers/rolePrivilege'));
app.use(require('./controllers/authFilter'));
app.use(require('./controllers/route'));
app.use(require('./controllers/error').notFound);
app.use(require('./controllers/error').errorHandler);

module.exports = app;