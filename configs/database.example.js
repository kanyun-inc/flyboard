'use strict';

// Options used by [knex]: https://github.com/tgriesser/knex
//
// Here is a simple configuration:
//
// ```javascript
// development: {
//     client: 'sqlite3',
//     connection: {
//         filename: './flyboard.sqlite'
//     }
// }
// ```
//
// Documents can be found here:
//
// - http://knexjs.org/#Installation-client

module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: './flyboard.sqlite'
        }
    },

    test: {
        client: 'mysql',
        connection: {
            database: 'flyboard'
        }
    }
};
