'use strict';

var router = require('express').Router();
module.exports = router;

var bodyParser = require('body-parser');
var blueBird = require('bluebird');
var Record = require('../logicals/record');
var DataSource = require('../logicals/dataSource');
var Project = require('../logicals/project');
var Folder = require('../logicals/folder');
var apiAuthFilter = require('./apiAuthFilter');

router.get(
    '/api/folders',
    function (req, res, next) {
        var projectId = parseInt(req.param('project_id', 10));
        var userId = req.user ? req.user.id : null;
        var query = {};

        if(projectId){
            query.project_id = projectId;
        }

        apiAuthFilter.vertifyProjectAuthority(userId, projectId)
            .then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return Folder.find(query);
            }).then(function (folders) {
                if(!folders) {
                    return res.send(404);
                }

                return res.send(folders);
            }).catch(next);
    }
);

router.get(
    '/api/folders/:id',
    function(req, res, next){
        var id = parseInt(req.param('id'), 10);
        var userId = req.user ? req.user.id : null;

        Folder.get(id)
            .then(function (folder) {
                if (!folder) {
                    return res.send(404);
                }

                return apiAuthFilter.vertifyProjectAuthority(userId, folder.project_id);
            }).then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return Folder.get(id);
            }).then(function (folder){
                return res.send(folder);
            }).catch(next);
    }
);

router.get(
    '/api/folders/:parent_id/folders',
    function(req, res, next){
        var parentId = parseInt(req.param('parent_id'), 10);
        var projectId = parseInt(req.param('project_id', 10));
        var userId = req.user ? req.user.id : null;

        var query = {
            parent_id: parentId ? parentId : null
        };

        if(projectId){
            query.project_id = projectId;
        }

        Folder.get(parentId)
            .then(function (parentFolder){
                if(!parentFolder){
                    return apiAuthFilter.vertifyProjectAuthority(userId, null);
                }
                else{
                    return apiAuthFilter.vertifyProjectAuthority(userId, parentFolder.project_id);
                }
            }).then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return Folder.find(query);
            }).then(function (folders){
                if(!folders){
                    return res.send(404);
                }

                return res.send(folders);
            }).catch(next);
    }
);

router.post(
    '/api/folders',
    bodyParser.json(),
    function(req, res, next){
        var folder = req.body;
        var userId = req.user ? req.user.id : null;
        if(!folder.name || !folder.project_id){
            return res.send(400);
        }

        apiAuthFilter.vertifyProjectAuthority(userId, folder.project_id)
            .then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return Project.get(folder.project_id);
            }).then(function (project) {
                if(!project) {
                    return res.send(404);
                }

                if(folder.parent_id){
                    return Folder.get(folder.parent_id).then(function (folder) {
                        if(!folder) {
                            return res.send(404);
                        }
                    });
                }
                else{
                    return blueBird.resolve(null);
                }
            }).then(function () {
                return Folder.save(folder);
            }).then(function (id) {
                return Folder.get(id);
            }).then(function (folder) {
                return res.send(folder);
            }).catch(next);
    }
);

router.put(
    '/api/folders/:id',
    bodyParser.json(),
    function (req, res, next) {
        var id = parseInt(req.param('id', 10));
        var userId = req.user ? req.user.id : null;

        var folder = req.body;
        if(!folder.name || !folder.project_id){
            return res.send(400);
        }

        apiAuthFilter.vertifyProjectAuthority(userId, folder.project_id)
            .then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                return Project.get(folder.project_id);
            }).then(function (project) {
                if(!project) {
                    return res.send(404);
                }

                if(folder.parent_id){
                    return Folder.get(folder.parent_id).then(function (folder) {
                        if(!folder) {
                            return res.send(404);
                        }
                    });
                }
                else{
                    return blueBird.resolve(null);
                }
            }).then(function () {
                return Folder.update(id, folder);
            }).then(function() {
                return Folder.get(id);
            }).then(function (folder) {
                return res.send(folder);
            }).catch(next);
    }
);

router.delete(
    '/api/folders/:id',
    function(req, res, next) {
        var id = parseInt(req.param('id'), 10);
        var userId = req.user ? req.user.id : null;
        var recursive = req.param('recursive') === 'true' || false;

        function deleteFolderRecursive (id) {

            return Folder.get(id)
                .then(function (folder) {
                    if(!folder) {
                        return [];
                    }

                    var promises = [];
                    var pros = [];

                    //delete child folders
                    promises = Folder.find({
                        parent_id: folder.id
                    }).then(function (folders) {

                        return folders.map(function (subFolder) {
                            // delete recursively
                            return deleteFolderRecursive(subFolder.id);
                        });
                    });

                    //delete child dataSources
                    pros = DataSource.find({
                        folder_id: folder.id
                    }).then(function (dataSources) {

                        return dataSources.map(function (dataSource) {
                            return Record.removeList(dataSource.id).then(function (){
                                return DataSource.remove(dataSource.id);
                            });
                        });
                    });

                    return blueBird.all([blueBird.all(promises), blueBird.all(pros)]).then(function(){

                        return Folder.remove(folder.id);
                    });
            });
        }

        Folder.get(id)
            .then(function (folder){
                return apiAuthFilter.vertifyProjectAuthority(userId, folder.project_id);
            }).then(function (authResult) {
                if (!authResult) {
                    return res.send(403);
                }

                if (!recursive) {
                    return Folder.get(id).then(function (folder) {
                        if (!folder) {
                            return res.send(404);
                        }

                        var promises = [];
                        var pros = [];

                        //set parent of child folders to folder.parent_id
                        promises = Folder.find({
                            parent_id: folder.id
                        }).then(function (folders) {
                            return folders.map(function (subFolder) {

                                subFolder.parent_id = folder.parent_id;
                                return Folder.update(subFolder.id, subFolder);
                            });
                        });

                        //set parent of child dataSources to folder.parent_id
                        pros = DataSource.find({
                            folder_id: folder.id
                        }).then(function (dataSources) {

                            return dataSources.map(function (dataSource) {
                                dataSource.folder_id = folder.parent_id;
                                return DataSource.update(dataSource.id, dataSource);
                            });
                        });

                        return blueBird.all([blueBird.all(promises), blueBird.all(pros)]).then(function () {

                            return Folder.remove(id).then(function () {
                                return res.send(200, 'ok');
                            });
                        });
                    });
                }
                else {
                    return deleteFolderRecursive(id).then(function () {
                        return res.send(200);
                    });
                }
            }).catch(next);
    }
);