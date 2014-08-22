'use strict';

exports.up = function (knex) {
    return knex.schema.dropTableIfExists('folders')
        .then(function () {
            return knex.schema.createTable('folders', function (table) {
                table.charset('utf8');
                table.engine('Innodb');
                table.increments();
                table.timestamps();

                table.string('name').notNullable();
                table.integer('parent_id');
            });
        }).then(function () {
            return knex.schema.table('data_sources', function (table) {
                table
                    .integer('folder_id')
                    .unsigned();
            });
        });
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('folders')
    ]);
};
