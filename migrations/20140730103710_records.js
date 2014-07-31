'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
            knex.schema.table('records', function (table) {
                table.datetime('date_time');
            })
        ]);
};

exports.down = function() {
};
