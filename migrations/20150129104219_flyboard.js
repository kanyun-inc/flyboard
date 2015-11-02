'use strict';

exports.up = function(knex, Promise) {
    var globalUserId = null;
    var localUserId = null;

    return knex('roles')
            .returning('id')
            .insert({
                name: 'admin',
                scope: 2
            }).then(function (rets) {
                globalUserId = rets[0];

                return knex('roles')
                        .returning('id')
                        .insert({
                            name: 'member',
                            scope: 1
                        }).then(function (rets) {
                            localUserId = rets[0];
                        });

            }).then(function () {

                // initial table 'role_privilege'
                return knex('role_privileges')
                    .insert([
                        {
                            resource: 'PROJECT',
                            operation: 'GET',
                            role_id: globalUserId
                        },
                        {
                            resource: 'PROJECT',
                            operation: 'POST',
                            role_id: globalUserId
                        },
                        {
                            resource: 'PROJECT',
                            operation: 'PUT',
                            role_id: globalUserId
                        },
                        {
                            resource: 'PROJECT',
                            operation: 'DELETE',
                            role_id: globalUserId
                        },
                        {
                            resource: 'PROJECT',
                            operation: 'GET',
                            role_id: localUserId
                        },
                        {
                            resource: 'PROJECT',
                            operation: 'PUT',
                            role_id: localUserId
                        }
                    ]);
            });
};

exports.down = function (knex, Promise) {
    return Promise.resolve(true);
};
