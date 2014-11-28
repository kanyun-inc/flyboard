'use strict';

exports.up = function(knex, Promise) {
    return knex.schema.table('dashboards', function(table){
        table.boolean('private');
        table.string('owner_id')
            .references('id')
            .inTable('users');
    });
};

exports.down = function(knex, Promise) {
  
};
