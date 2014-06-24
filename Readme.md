# Flyboard [![Build Status](https://travis-ci.org/yuantiku/flyboard.png?branch=master)](https://travis-ci.org/yuantiku/flyboard)

Flyboard 是一套数据可视化系统。通常的数据可视化系统往往很复杂，并且为业务高度定制化，通用性差维护成本高。Flyboard 系统要解决这些问题，实现一个简单、通用的数据可视化系统。

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
