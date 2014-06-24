'use strict';

exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('projects'),
        knex.schema.createTable('projects', function (table) {
            table.increments();
            table.timestamps();

            table.string('name');
        }),

        knex.schema.dropTableIfExists('dashboards'),
        knex.schema.createTable('dashboards', function (table) {
            table.increments();
            table.timestamps();

            table.string('name');
        }),

        knex.schema.dropTableIfExists('widgets'),
        knex.schema.createTable('widgets', function (table) {
            table.increments();
            table.timestamps();

            table.integer('dashboard_id');
            table.text('config');
            table.integer('type');
        }),

        knex.schema.dropTableIfExists('data_sources'),
        knex.schema.createTable('data_sources', function (table) {
            table.increments();
            table.timestamps();

            table.integer('project_id');
            table.string('name');
            table.string('guid');
        }),

        knex.schema.dropTableIfExists('records'),
        knex.schema.createTable('records', function (table) {
            table.increments();
            table.timestamps();

            table.integer('data_source_id');
            table.integer('value');

            table.integer('year');
            table.integer('month');
            table.integer('day');
            table.integer('hour');
            table.integer('minute');
            table.integer('second');
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('projects'),
        knex.schema.dropTableIfExists('dashboards'),
        knex.schema.dropTableIfExists('widgets'),
        knex.schema.dropTableIfExists('data_sources'),
        knex.schema.dropTableIfExists('records')
    ]);
};
