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

        knex.schema.dropTableIfExists('role_privileges'),
        knex.schema.createTable('role_privileges', function (table) {
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

        knex.schema.dropTableIfExists('user_roles'),
        knex.schema.createTable('user_roles', function (table) {
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
                .unsigned();
        })
     ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.dropTable('users'),
      knex.schema.dropTable('roles'),
      knex.schema.dropTable('role_privileges'),
      knex.schema.dropTable('user_roles')
  ]);
};