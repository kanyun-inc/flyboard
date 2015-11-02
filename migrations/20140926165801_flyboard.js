'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('records', function (table) {
            table.string('dim3');
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.resolve(true);
};
