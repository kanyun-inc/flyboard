'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
             knex.schema.table('folders', function (table) {
                 table.integer('project_id');
             })
         ]);
};

exports.down = function (knex, Promise) {
    return Promise.resolve(true);
};
