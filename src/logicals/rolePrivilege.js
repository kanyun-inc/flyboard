'use strict';

var knex = require('../lib/knex');

exports.find = function (query){
    query = query || {};
    return knex('role_privileges').where(query).select();
};

exports.findOne = function (query){
    query = query || {};
    return knex('role_privileges').where(query).select().first();
};

exports.save = function (obj) {
    return knex('role_privileges').insert(obj);
};

exports.remove = function (query){
    return knex('role_privileges').where(query).del();
};