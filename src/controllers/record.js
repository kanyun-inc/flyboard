'use strict';

var router = require('express').Router();
module.exports = router;

var bodyParser = require('body-parser');
var DataSource = require('../logicals/dataSource');
var Record = require('../logicals/record');

router.post(
    '/api/projects/:uuid/data_sources/:key',
    bodyParser.json(),
    function(req, res, next){
        var record = req.body;
        if(!record.value){
            res.send(400);
        }

        DataSource.getByUUIDAndKey(req.param('uuid'), req.param('key')).then(function (dataSource) {
            if (!dataSource) {
                return res.send(404);
            }

            record.data_source_id = dataSource.id;
            return Record.save(record).then(function (id) {
                return Record.get(id);
            }).then(function (record) {
                res.send(record);
            });
        }).catch(next);
    }
);