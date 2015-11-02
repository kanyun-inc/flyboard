'use strict';

exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.table('dashboards', function (table) {
            table.json('config');
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.resolve(true);
};
