'use strict';

exports.up = function(knex) {
    return knex.schema.table('data_sources', function (table) {
        table.json('config');
    }).then(function () {
        return knex.schema.table('records', function (table) {
            table.string('dim1');
            table.string('dim2');
        });
    });
};

exports.down = function (knex, Promise) {
    return Promise.resolve(true);
};
