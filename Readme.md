# Flyboard [![Build Status](https://travis-ci.org/yuantiku/flyboard.png?branch=master)](https://travis-ci.org/yuantiku/flyboard)

Flyboard 是一套数据可视化系统。通常的数据可视化系统往往很复杂，并且为业务高度定制化，通用性差维护成本高。Flyboard 系统要解决这些问题，实现一个简单、通用的数据可视化系统。

## 环境依赖

Flyboard 依赖 MySQL 数据库来存储统计数据。

## 调试开发

Flyboard 可以很方便的在本地进行调试。

复制 `configs/mysql.example.js` 到 `configs/mysql.js` 并编辑配置文件，提供一份合适的 mysql 配置。

安装依赖:

```bash
npm install
```

运行服务:

```bash
DEBUG=flyboard node bin/www
```

## License 

MIT
