'use strict';

var knex = require('../lib/knex');

exports.find = function (query){
    query = query || {};
    return knex('role_privilege').where(query).select();
};

exports.save = function (obj) {
    return knex('role_privilege').insert(obj);
};