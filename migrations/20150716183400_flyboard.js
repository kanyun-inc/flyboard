'use strict';

exports.up = function(knex) {
    return knex.schema.table('dashboards', function(table){
        table.integer('rank').unsigned();
    });
};

exports.down = function() {
};
