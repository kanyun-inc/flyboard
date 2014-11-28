'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('users', function (table) {
            table.string('salt');
        })
    ]);
};

exports.down = function(knex, Promise) {

};
