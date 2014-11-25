'use strict';

var router = require('express').Router();
var notFound = require('./error').notFound;
var errHandler = require('./error').errorHandler;

module.exports = router;

router.get('/404', notFound, errHandler);