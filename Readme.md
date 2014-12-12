# Flyboard

[![NPM version](https://badge.fury.io/js/flyboard.svg)](http://badge.fury.io/js/flyboard)
[![Build Status](https://travis-ci.org/yuantiku/flyboard.png?branch=master)](https://travis-ci.org/yuantiku/flyboard)
[![Coverage Status](https://coveralls.io/repos/yuantiku/flyboard/badge.png?branch=master)](https://coveralls.io/r/yuantiku/flyboard?branch=master)
[![Code Climate](https://codeclimate.com/github/yuantiku/flyboard.png)](https://codeclimate.com/github/yuantiku/flyboard)

简单、灵活、友好的数据可视化系统。

## 安装

```bash
$ git clone git://github.com/yuantiku/flyboard.git && cd flyboard
$ npm install
```

Flyboard 支持的数据库有 Postgres, MySQL, MariaDB 以及 SQLite3，根据实际需要安装数据库驱动。

```bash
$ npm install mysql
$ npm install mariasql
$ npm install pg
$ npm install sqlite3
```

编辑数据库配置，数据库配置文件参考 [knex 文档](http://knexjs.org/#Installation-client)

```bash
cp configs/database.example.js config/database.js
vim config/database.js
```

初始化 APP 配置

```bash
cp configs/app.example.js configs/app.js
```

初始化数据库

```bash
npm run migrate:latest
```

运行服务:

```bash
DEBUG=flyboard node bin/www
```

## License 

MIT
