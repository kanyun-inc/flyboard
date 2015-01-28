#### Clone代码

```bash
$ git clone git://github.com/yuantiku/flyboard
```

#### 安装依赖

```bash
$ npm install
$ npm install sqlite3 # OR npm install mysql
$ npm install -g mocha supervisor
```

#### 配置数据库

复制 `configs/database.example.js` 为 `configs/database.js`，然后编辑数据库配置。

然后，

* 运行 `npm run migrate:make` 新建一个migration文件, 在migration文件中配置table的结构。
* 运行 `npm run migrate:latest` 运行所有新建的migration文件, 并修改数据库中的table的结构.
* 运行 `npm run migrate:rollback`进行回滚，撤销上一次运行的所有migration文件中的操作。

#### 启动服务

```bash
$ DEBUG=flyboard supervisor bin/www
```

#### 运行单元测试

重新打开一个终端，运行 `mocha -w` 实时查看单元测试的运行状况。