'use strict';

process.env.UNIT_TEST = true;

var knex = require('../src/lib/knex');
var Migrate = require('knex/lib/migrate');
var path = require('path');
var assert = require('chai').assert;
var Promise = require('bluebird');
var fs = require('fs');

var Project = require('../src/logicals/project'),
    Dashboard = require('../src/logicals/dashboard'),
    Widget = require('../src/logicals/widget'),
    DataSource = require('../src/logicals/dataSource'),
    Record = require('../src/logicals/record');

describe('knex', function () {
    describe('migrate', function () {
        it('should create correct tables', function (done) {
            var migrate = new Migrate(knex);

            migrate.latest({
                directory: path.join(__dirname, '../migrations')
            }).then(function () {
                return Promise.all([
                    knex.schema.hasTable('projects'),
                    knex.schema.hasTable('records'),
                    knex.schema.hasTable('data_sources'),
                    knex.schema.hasTable('widgets'),
                    knex.schema.hasTable('dashboards')
                ]).then(function (rets) {
                    rets.forEach(function (ret) {
                        assert.isTrue(ret);
                    });
                });
            }).then(done);
        });
    });

    it('should work', function () {
        assert.isFunction(knex);
        assert.isFunction(knex.select);
    });

    /* -------------------- Project Model ----------------------- */
    describe('project model', function () {
        beforeEach(function (done) {
            Promise.all([
                knex('projects').insert({
                    name: 'foo'
                }),
                knex('projects').insert({
                    name: 'bar'
                })
            ]).then(function () {
                done();
            });
        });

        describe('#get', function () {
            it('should return an object', function (done) {
                Project.get(1).then(function (ret) {
                    assert.isObject(ret);
                    assert.equal(ret.name, 'foo');
                    done();
                });
            });
        });

        describe('#find', function () {
            it('should return a list', function (done) {
                Project.find().then(function (ret) {
                    assert.isArray(ret);
                    assert.equal(ret.length, 2);
                    done();
                });
            });
        });

        describe('#save', function () {
            it('should save new object', function (done) {
                Project.save({
                    name: 'baz'
                }).then(function (id) {
                    return Project.get(id);
                }).then(function (ret) {
                    assert.equal(ret.name, 'baz');
                    done();
                });
            });
        });

        describe('#update', function () {
            it('should save new object', function (done) {
                Project.save({
                    name: 'baz'
                }).then(function (id) {
                    return Project.update(id, {
                        name: 'xxx'
                    }).then(function () {
                        return id;
                    });
                }).then(function (ret) {
                    return Project.get(ret);
                }).then(function (ret) {
                    assert.equal(ret.name, 'xxx');
                    done();
                });
            });
        });

        describe('#remove', function () {
            it('should delete object', function (done) {
                Project.remove(1).then(function () {
                    return Project.get(1);
                }).then(function (ret) {
                    assert.isUndefined(ret);
                    done();
                });
            });
        });

        afterEach(function (done) {
            knex('projects').del().then(function () {
                done();
            });
        });
    });

    /* -------------------- Dashboard Model ----------------------- */
    describe('dashboard model', function () {
        beforeEach(function (done) {
            Promise.all([
                knex('dashboards').insert({
                    name: 'foo'
                }),
                knex('dashboards').insert({
                    name: 'bar'
                })
            ]).then(function () {
                done();
            });
        });

        describe('#get', function () {
            it('should return an object', function (done) {
                Dashboard.get(1).then(function (ret) {
                    assert.isObject(ret);
                    assert.equal(ret.name, 'foo');
                    done();
                });
            });
        });

        describe('#find', function () {
            it('should return a list', function (done) {
                Dashboard.find().then(function (ret) {
                    assert.isArray(ret);
                    assert.equal(ret.length, 2);
                    done();
                });
            });
        });

        describe('#save', function () {
            it('should save new object', function (done) {
                Dashboard.save({
                    name: 'baz'
                }).then(function (id) {
                    return Dashboard.get(id);
                }).then(function (ret) {
                    assert.equal(ret.name, 'baz');
                    done();
                });
            });
        });

        describe('#update', function () {
            it('should save new object', function (done) {
                Dashboard.save({
                    name: 'baz'
                }).then(function (id) {
                    return Dashboard.update(id, {
                        name: 'xxx'
                    }).then(function () {
                        return id;
                    });
                }).then(function (ret) {
                    return Dashboard.get(ret);
                }).then(function (ret) {
                    assert.equal(ret.name, 'xxx');
                    done();
                });
            });
        });

        describe('#remove', function () {
            it('should delete object', function (done) {
                Dashboard.remove(1).then(function () {
                    return Dashboard.get(1);
                }).then(function (ret) {
                    assert.isUndefined(ret);
                    done();
                });
            });
        });

        afterEach(function (done) {
            knex('dashboards').del().then(function () {
                done();
            });
        });
    });

    /* -------------------- Widget Model ----------------------- */
    describe('widget model', function () {
        beforeEach(function (done) {
            Promise.all([
                Widget.save({
                    dashboard_id: 111,
                    type: 1,
                    config: {size: 10}
                }),
                Widget.save({
                    dashboard_id: 123,
                    type: 1,
                    config: {size: 10}
                })
            ]).then(function () {
                done();
            });
        });

        describe('#get', function () {
            it('should return an object', function (done) {
                Widget.get(1).then(function (ret) {
                    assert.isObject(ret);
                    assert.equal(ret.dashboard_id, 111);
                    done();
                });
            });
        });

        describe('#find', function () {
            it('should return a list', function (done) {
                Widget.find().then(function (ret) {
                    assert.isArray(ret);
                    assert.equal(ret.length, 2);
                    done();
                });
            });
        });

        describe('#save', function () {
            it('should save new object', function (done) {
                Widget.save({
                    dashboard_id: 100,
                    type: 1,
                    config: {size: 10}
                }).then(function (id) {
                    return Widget.get(id);
                }).then(function (ret) {
                    assert.equal(ret.dashboard_id, 100);
                    done();
                });
            });
        });

        describe('#update', function () {
            it('should save new object', function (done) {
                Widget.save({
                    dashboard_id: 100,
                    type: 1,
                    config: {size: 10}
                }).then(function (id) {
                    return Widget.update(id, {
                        dashboard_id: 200
                    }).then(function () {
                        return id;
                    });
                }).then(function (ret) {
                    return Widget.get(ret);
                }).then(function (ret) {
                    assert.equal(ret.dashboard_id, 200);
                    done();
                });
            });
        });

        describe('#remove', function () {
            it('should delete object', function (done) {
                Widget.remove(1).then(function () {
                    return Widget.get(1);
                }).then(function (ret) {
                    assert.isUndefined(ret);
                    done();
                });
            });
        });

        afterEach(function (done) {
            knex('widgets').del().then(function () {
                done();
            });
        });
    });

    /* -------------------- DataSource Model ----------------------- */
    describe('data_sources model', function () {
        beforeEach(function (done) {
            Promise.all([
                DataSource.save({
                    name: 'foo',
                    project_id: 1
                }),
                DataSource.save({
                    name: 'bar',
                    project_id: 1
                })
            ]).then(function () {
                done();
            });
        });

        describe('#get', function () {
            it('should return an object', function (done) {
                DataSource.get(1).then(function (ret) {
                    assert.isObject(ret);
                    assert.equal(ret.name, 'foo');
                    done();
                });
            });
        });

        describe('#find', function () {
            it('should return a list', function (done) {
                DataSource.find().then(function (ret) {
                    assert.isArray(ret);
                    assert.equal(ret.length, 2);
                    done();
                });
            });
        });

        describe('#save', function () {
            it('should save new object', function (done) {
                DataSource.save({
                    name: 'baz',
                    project_id: 1
                }).then(function (id) {
                    return DataSource.get(id);
                }).then(function (ret) {
                    assert.equal(ret.name, 'baz');
                    done();
                });
            });
        });

        describe('#update', function () {
            it('should save new object', function (done) {
                DataSource.save({
                    name: 'baz',
                    project_id: 1
                }).then(function (id) {
                    return DataSource.update(id, {
                        name: 'xxx'
                    }).then(function () {
                        return id;
                    });
                }).then(function (ret) {
                    return DataSource.get(ret);
                }).then(function (ret) {
                    assert.equal(ret.name, 'xxx');
                    done();
                });
            });
        });

        describe('#remove', function () {
            it('should delete object', function (done) {
                DataSource.remove(1).then(function () {
                    return DataSource.get(1);
                }).then(function (ret) {
                    assert.isUndefined(ret);
                    done();
                });
            });
        });

        afterEach(function (done) {
            knex('data_sources').del().then(function () {
                done();
            });
        });
    });

    /* -------------------- Record Model ----------------------- */
    describe('record model', function () {
        beforeEach(function (done) {
            Promise.all([
                knex('records').insert({
                    data_source_id: 1,
                    value: 111
                }),
                knex('records').insert({
                    data_source_id: 1,
                    value: 123
                })
            ]).then(function () {
                done();
            });
        });

        describe('#get', function () {
            it('should return an object', function (done) {
                Record.get(1).then(function (ret) {
                    assert.isObject(ret);
                    assert.equal(ret.data_source_id, 1);
                    done();
                });
            });
        });

        describe('#find', function () {
            it('should return a list', function (done) {
                Record.find().then(function (ret) {
                    assert.isArray(ret);
                    assert.equal(ret.length, 2);
                    done();
                });
            });
        });

        describe('#save', function () {
            it('should save new object', function (done) {
                Record.save({
                    data_source_id: 1,
                    value: 100
                }).then(function (id) {
                    return Record.get(id);
                }).then(function (ret) {
                    assert.equal(ret.value, 100);
                    done();
                });
            });
        });

        describe('#update', function () {
            it('should save new object', function (done) {
                Record.save({
                    data_source_id: 1,
                    value: 100
                }).then(function (id) {
                    return Record.update(id, {
                        value: 200
                    }).then(function () {
                        return id;
                    });
                }).then(function (ret) {
                    return Record.get(ret);
                }).then(function (ret) {
                    assert.equal(ret.value, 200);
                    done();
                });
            });
        });

        describe('#remove', function () {
            it('should delete object', function (done) {
                Record.remove(1).then(function () {
                    return Record.get(1);
                }).then(function (ret) {
                    assert.isUndefined(ret);
                    done();
                });
            });
        });

        afterEach(function (done) {
            knex('records').del().then(function () {
                done();
            });
        });
    });


    after(function (done) {
        fs.unlink(path.join(__dirname, '../flyboard.sqlite'), done);
    });
});
