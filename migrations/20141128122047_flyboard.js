'use strict';

exports.up = function(knex, Promise) {
    return knex.schema.table('dashboards', function(table){
        table.boolean('private');
        table.integer('owner_id')
            .unsigned()
            .references('id')
            .inTable('users');
    });
};

exports.down = function (knex, Promise) {
    return Promise.resolve(true);
};
