'use strict';

exports.up = function (knex, Promise) {
    return Promise.all([
            knex.schema.table('data_sources', function (table) {
                table.boolean('increment');
            })
        ]);
};

exports.down = function (knex, Promise) {
    return Promise.resolve(true);
};
