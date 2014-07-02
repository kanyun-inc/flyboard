'use strict';

exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('projects'),
        knex.schema.createTable('projects', function (table) {
            table.charset('utf8');
            table.engine('Innodb');
            table.increments();
            table.timestamps();

            table.string('name').notNullable();
            table
                .uuid('uuid')
                .unique()
                .index()
                .notNullable();
        }),

        knex.schema.dropTableIfExists('dashboards'),
        knex.schema.createTable('dashboards', function (table) {
            table.charset('utf8');
            table.engine('Innodb');
            table.increments();
            table.timestamps();

            table.string('name').notNullable();
        }),

        knex.schema.dropTableIfExists('widgets'),
        knex.schema.createTable('widgets', function (table) {
            table.charset('utf8');
            table.engine('Innodb');
            table.increments();
            table.timestamps();

            table
                .integer('dashboard_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('dashboards');
            table.json('config').notNullable().defaultTo('{}');
            table.integer('type').notNullable();
        }),

        knex.schema.dropTableIfExists('data_sources'),
        knex.schema.createTable('data_sources', function (table) {
            table.charset('utf8');
            table.engine('Innodb');
            table.increments();
            table.timestamps();

            table.string('name').notNullable();

            table
                .integer('project_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('projects');

            table
                .string('key')
                .unique()
                .index()
                .notNullable();
        }),

        knex.schema.dropTableIfExists('records'),
        knex.schema.createTable('records', function (table) {
            table.charset('utf8');
            table.engine('Innodb');
            table.increments();
            table.timestamps();

            table
                .integer('data_source_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('data_sources');

            table.integer('value').notNullable();
            table.integer('year').nullable();
            table.integer('month').nullable();
            table.integer('day').nullable();
            table.integer('hour').nullable();
            table.integer('minute').nullable();
            table.integer('second').nullable();
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('records'),
        knex.schema.dropTable('data_sources'),
        knex.schema.dropTable('widgets'),
        knex.schema.dropTable('dashboards'),
        knex.schema.dropTable('projects')
    ]);
};
