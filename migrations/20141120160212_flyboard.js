'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('users'),
        knex.schema.createTable('users', function (table) {
            table.charset('utf8');
            table.engine('Innodb');

            table.increments();
            table.string('email').notNullable();
        }),

        knex.schema.dropTableIfExists('roles'),
        knex.schema.createTable('roles', function (table) {
            table.charset('utf8');
            table.engine('Innodb');

            table.increments();
            table.string('name').notNullable();
            table.integer('scope').notNullable();
        }),

        knex.schema.dropTableIfExists('role_privilege'),
        knex.schema.createTable('role_privilege', function (table) {
            table.charset('utf8');
            table.engine('Innodb');

            table.string('resource').notNullable();
            table.string('operation').notNullable();
            table
                .integer('role_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('roles');
        }),

        knex.schema.dropTableIfExists('user_role'),
        knex.schema.createTable('user_role', function (table) {
            table.charset('utf8');
            table.engine('Innodb');

            table.increments();
            table
                .integer('user_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('users');
            table
                .integer('role_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('roles');
            table
                .integer('project_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('projects');
        })
     ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.dropTable('users'),
      knex.schema.dropTable('roles'),
      knex.schema.dropTable('role_privilege'),
      knex.schema.dropTable('user_role')
  ]);
};