'use strict';

var profileApp = angular.module('profileApp', [
    'ngRoute',
    'services',
    'directives'
]);

profileApp.controller('ProfileCtrl', ['$scope', '$q', 'Project', 'CurrentUser', 'UserReset', 'User', 'UserRole', 'Role', 'RolePrivilege',
    function ($scope, $q, Project, CurrentUser, UserReset, User, UserRole, Role, RolePrivilege){
        $scope.profile = {
            user: {},
            roles: [],
            projects: []
        };
        $scope.admin = {
            users: [],
            userMap: {},
            roles: [],
            roleMap: {},
            roleRolePrivilegeMap: {},
            userUserRoleMap: {},
            projects: [],
            projectUserRoleMap: {}
        };

        /**** profile information ****/

        var userProfilePromise = CurrentUser.get().$promise;

        var projectsProfilePromise = userProfilePromise.then(function (user){
            $scope.profile.user = user || {};

            return UserRole.query({
                user_id: user.id
            }).$promise;
        });

        var rolesProfilePromise = projectsProfilePromise.then(function (userRoles){
            if(!userRoles || userRoles.length === 0){
                return false;
            }

            $scope.profile.projects = userRoles.map(function (userRole){
                return userRole.project_id;
            }).filter(function (id){
                return id !== 0;
            }).map(function (id){
                return Project.get({
                    id: id
                });
            });

            var roleIds = [];
            userRoles.map(function (ur){
                var flag = roleIds.some(function (roleId){
                    return ur.role_id === roleId;
                });

                if(!flag){
                    roleIds.push(ur.role_id);
                }
            });

            return roleIds.map(function (roleId){
                return Role.get({
                    id: roleId
                });
            });
        });

        /**** admin information ****/

        var usersAdminPromise = rolesProfilePromise.then(function (roles){
            if(!roles){
                return false;
            }

            $scope.profile.roles = roles;

            return User.query().$promise;
        });

        var rolesAdminPromise = usersAdminPromise.then(function (users){
            if(!users || users.length === 0){
                return false;
            }

            $scope.admin.users = users;
            $scope.admin.userMap = angular.copy(users).reduce(function (memo, curr) {
                   memo[curr.id] = curr;
                   return memo;
                }, {});

            $scope.admin.userUserRoleMap = angular.copy(users).reduce(function (memo, curr) {
                    memo[curr.id] = UserRole.query({
                       user_id: curr.id
                    });

                    return memo;
                }, {});

            return Role.query().$promise;
        });

        var projectsAdminPromise = rolesAdminPromise.then(function (roles){
            if(!roles || roles.length === 0){
                return false;
            }

            $scope.admin.roles = roles;
            $scope.admin.roleMap = angular.copy(roles).reduce(function (memo, curr) {
                    memo[curr.id] = Role.get({
                       id: curr.id
                    });

                    return memo;
                }, {});

            $scope.admin.roleRolePrivilegeMap = angular.copy(roles).reduce(function (memo, curr) {
                    memo[curr.id] = RolePrivilege.query({
                       role_id: curr.id
                    });

                    return memo;
                }, {});

            return Project.query().$promise;
        });

        var projectUserRoleMapAdminPromise = projectsAdminPromise.then(function (projects){
            if(!projects || projects.length === 0){
                return false;
            }

            $scope.admin.projects = projects;

            return angular.copy(projects).reduce(function (memo, curr) {
                   memo[curr.id] = {
                       global: UserRole.query({
                               project_id: 0
                           }),
                       local: UserRole.query({
                               project_id: curr.id
                           })
                   };
                   return memo;
                }, {});
        }).then(function (ret){
            $scope.admin.projectUserRoleMap = ret;
        });

        //reset salt
        $scope.resetSalt = function (){
            UserReset.update({
                id: $scope.profile.user.id
            }, $scope.profile.user).$promise
            .then(function (user){
                $scope.profile.user = user;
            });
        };

        //delete member from project
        $scope.deleteMember = function (userRole){
            // global user can not be deleted
            if(!userRole){
                return ;
            }

            UserRole.delete({
                id: userRole.id
            }).$promise.then(function (){

                //upate projctUserRoleMap
                if(userRole.project_id !== 0){
                    var pumIdx = $scope.admin.projectUserRoleMap[userRole.project_id].local.indexOf(userRole);
                    if (pumIdx === -1) {
                        return;
                    }

                    $scope.admin.projectUserRoleMap[userRole.project_id].local.splice(pumIdx, 1);
                }
                else{
                    $scope.admin.projects.map(function (project){
                        var idx = null;
                        $scope.admin.projectUserRoleMap[project.id].global.some(function (ur, index){
                            if(ur.user_id === userRole.user_id){
                                idx = index;
                                return true;
                            }
                        });

                        if(!idx){
                            return ;
                        }

                        $scope.admin.projectUserRoleMap[project.id].global.splice(idx, 1);
                    });
                }

                //update userUserRoleMap
                var uumIdx = null;
                $scope.admin.userUserRoleMap[userRole.user_id].some(function (ur, index){
                    if(ur.role_id === userRole.role_id && ur.project_id === userRole.project){
                        uumIdx = index;
                        return true;
                    }
                });

                $scope.admin.userUserRoleMap[userRole.user_id].splice(uumIdx, 1);
            });
        };
    }
]);

profileApp.controller('addUserRoleCtrl', ['$scope', '$modal',
    function ($scope, $modal) {
        var addUserRoleModalInstanceCtrl = ['$rootScope', '$scope', '$q', '$modalInstance', 'CurrentUser', 'UserRole', 'User', 'Role', 'Project', 'projectId', 'roleMap', 'projectUserRoleMap', 'userUserRoleMap',
            function ($rootScope, $scope, $q, $modalInstance, CurrentUser, UserRole, User, Role, Project, projectId, roleMap, projectUserRoleMap, userUserRoleMap) {
                $scope.userUserRoleMap = userUserRoleMap;
                $scope.roleMap = roleMap;
                $scope.user = CurrentUser.get();
                $scope.users = User.query().$promise.then(function (users){
                    $scope.users = users.filter(function (user){
                        return userUserRoleMap[user.id].length === 0 || roleMap[userUserRoleMap[user.id][0].role_id].scope !== 2;
                    });
                });
                $scope.roles = Role.query();
                $scope.roleSelection = $scope.roles;
                $scope.projects = Project.query();
                $scope.projectSelection = $scope.projects;

                $scope.newUserRole = {
                    project_id: projectId
                };

                $scope.ok = function(){
                    UserRole.save($scope.newUserRole).$promise.then(function (userRole){
                        if(userRole){
                            //update projectUserRoleMap
                            if(roleMap[userRole.role_id].scope !== 2){
                                projectUserRoleMap[userRole.project_id].local.push(userRole);
                            }
                            else{
                                $scope.projects.map(function (project){
                                    projectUserRoleMap[project.id].global.push(userRole);
                                });
                            }

                            //update userUserRoleMap
                            userUserRoleMap[userRole.user_id].push(userRole);
                        }

                        $modalInstance.close();
                    });
                };

                $scope.cancel = function(){
                    $modalInstance.dismiss('cancel');
                };


                $scope.updateRoleSelection = function () {
                    if(!$scope.newUserRole.user_id){
                        return ;
                    }

                    //user has no role
                    if($scope.userUserRoleMap[$scope.newUserRole.user_id].length === 0){
                        $scope.roleSelection = $scope.roles;
                    }
                    //user has role and is local ( global user won't be displayed )
                    else{
                        $scope.roleSelection = $scope.roles.filter(function (role){
                            return role.scope !== 2;
                        });

                        if($scope.newUserRole.role_id && $scope.roleMap[$scope.newUserRole.role_id].scope === 2){
                            $scope.newUserRole.role_id = null;
                        }
                    }

                    //update projectSelection
                    $scope.updateProjectSelection();
                };

                $scope.updateProjectSelection = function (){

                    if($scope.newUserRole.role_id && $scope.roleMap[$scope.newUserRole.role_id].scope === 2){
                        $scope.projectSelection = [{
                            id: 0,
                            name: '所有'
                        }];

                        $scope.newUserRole.project_id = 0;
                    }
                    else if($scope.newUserRole.role_id && $scope.roleMap[$scope.newUserRole.role_id].scope !== 2 && $scope.newUserRole.user_id){
                        //exclude projects already authoried to user
                        $scope.projectSelection = $scope.projects.filter(function (project){
                            var flag = $scope.userUserRoleMap[$scope.newUserRole.user_id].some(function (ur){
                                return ur.project_id === project.id;
                            });

                            return !flag;
                        });

                        var flag = $scope.projectSelection.some(function (project){
                            return project.id === $scope.newUserRole.project_id;
                        });

                        $scope.newUserRole.project_id = flag ? $scope.newUserRole.project_id : null;
                    }
                    else{
                        $scope.projectSelection = $scope.projects;
                        $scope.newUserRole.project_id = $scope.newUserRole.project_id || null;
                    }
                };
            }
        ];

        $scope.open = function (projectId, roleMap, projectUserRoleMap, userUserRoleMap) {
            var addUserRoleModalInstance = $modal.open({
                templateUrl: '/public/src/include/userRole_new_modal.html',
                controller: addUserRoleModalInstanceCtrl,
                resolve: {
                    projectId: function (){
                        return projectId;
                    },
                    roleMap: function (){
                        return roleMap;
                    },
                    projectUserRoleMap: function () {
                        return projectUserRoleMap;
                    },
                    userUserRoleMap: function (){
                        return userUserRoleMap;
                    }
                }
            });
        };
    }
]);