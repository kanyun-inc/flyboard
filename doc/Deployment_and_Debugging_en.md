#### Clone Source Code

```bash
$ git clone git://github.com/yuantiku/flyboard
```

#### Installation Dependency

```bash
$ npm install
$ npm install sqlite3 # OR npm install mysql
$ npm install -g mocha supervisor
```

#### Database Configuration

copy `configs/database.example.js` to `configs/database.js`，then edit it.

Then, 

* run `npm run migrate:make` to create a migration file, in which table configuration is edited.
* run `npm run migrate:latest` to run latest migration files, initialing tables structure.
* run `npm run migrate:rollback` to rollback migration files run last time.

#### Start Service

```bash
$ DEBUG=flyboard supervisor bin/www
```

#### Run Unit Testing

open a new terminal，and run `mocha -w` to view the conditions of unit testing in real time.