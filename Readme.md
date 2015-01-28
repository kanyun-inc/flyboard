# Flyboard

[![NPM version](https://badge.fury.io/js/flyboard.svg)](http://badge.fury.io/js/flyboard)
[![Build Status](https://travis-ci.org/yuantiku/flyboard.png?branch=master)](https://travis-ci.org/yuantiku/flyboard)
[![Coverage Status](https://coveralls.io/repos/yuantiku/flyboard/badge.png?branch=master)](https://coveralls.io/r/yuantiku/flyboard?branch=master)
[![Code Climate](https://codeclimate.com/github/yuantiku/flyboard.png)](https://codeclimate.com/github/yuantiku/flyboard)

A simple, flexible, friendly data visualization system.

## Installation

```bash
$ git clone git://github.com/yuantiku/flyboard.git && cd flyboard
$ npm install
```

Flyboard supports Postgres, MySQL, MariaDB and SQLite3, choose a database driver according to need.

```bash
$ npm install mysql
$ npm install mariasql
$ npm install pg
$ npm install sqlite3
```

For editing configuration of table and database connection, refer to [knex Document](http://knexjs.org/#Installation-client)

```bash
cp configs/database.example.js configs/database.js
vim configs/database.js
```

Initial APP Configuration

```bash
cp configs/app.example.js configs/app.js
```

Initial Database

```bash
npm run migrate:latest
```

Run Service:

```bash
DEBUG=flyboard node bin/www
```

## License 

MIT

