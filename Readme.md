# Flyboard

[![Build Status](https://travis-ci.org/yuantiku/flyboard.png?branch=master)](https://travis-ci.org/yuantiku/flyboard)
[![Coverage Status](https://coveralls.io/repos/yuantiku/flyboard/badge.png?branch=master)](https://coveralls.io/r/yuantiku/flyboard?branch=master)

简单、灵活、友好的数据可视化系统。

## 数据库

Flyboard 支持的数据库有 Postgres, MySQL, MariaDB 以及 SQLite3。

根据实际需要，安装合适的数据库驱动:

```bash
$ npm install mysql
$ npm install mariasql
$ npm install pg
$ npm install sqlite3
```

## 调试开发

Flyboard 可以很方便的在本地进行调试。

复制 `configs/databse.example.js` 到 `configs/databse.js` 并编辑配置文件，提供一份合适的数据库配置。

安装依赖:

```bash
$ npm install
# 根据实际需要安装数据库驱动
$ npm install mysql
$ npm install mariasql
$ npm install pg
$ npm install sqlite3
```

运行服务:

```bash
DEBUG=flyboard node bin/www
```

## License 

MIT
