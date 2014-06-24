'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');

var config = {};
if (!fs.existsSync(path.join(__dirname, '../../configs/database.js')) && !process.env.UNIT_TEST) {
    util.error('Please copy configs/database.sample.js to configs/database.js and add correct configurations.');
    util.error('Database configuration options can be found here: \n    http://knexjs.org/#Installation-client');
    process.exit(1);
}

var env = process.env.NODE_ENV || 'development';
config = process.env.UNIT_TEST ? require('../../configs/database.example')[env] : require('../../configs/database')[env];

module.exports = require('knex')(config);
