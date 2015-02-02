'use strict';

var widgetTypes = [
    {
        type: 1,
        label: '折线图'
    },
    {
        type: 2,
        label: '饼图'
    },
    {
        type: 3,
        label: '环形图'
    },
    {
        type: 4,
        label: '数字'
    },
    {
        type: 5,
        label: '柱形图'
    }
];

var indexApp = angular.module('indexApp', [
    'ngRoute',
    'services',
    'directives',
    'widgets',
    'ngAnimate',
    'ngNumeraljs',
    'ui.bootstrap'
]);

var gridLayer = {
    'rows': [
        {'columns': [
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1}
        ]
        },
        {'columns': [
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1}
        ]
        },
        {'columns': [
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1}
        ]
        },
        {'columns': [
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1}
        ]
        },
        {'columns': [
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1}
        ]
        },
        {'columns': [
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1}
        ]
        },
        {'columns': [
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1}
        ]
        },
        {'columns': [
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1}
        ]
        },
        {'columns': [
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1}
        ]
        },
        {'columns': [
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1}
        ]
        },
        {'columns': [
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1}
        ]
        },
        {'columns': [
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1},
            {'span': 1}
        ]
        }
    ]
};

//obj attribute: deep copy;  not obj attribute: copy
function copyWidget(oldWidget, newWidget) {
    angular.element.each(oldWidget, function (key) {
        if (key !== 'config') {
            oldWidget[key] = newWidget[key];
            return true;
        }

        //deep copy config
        angular.element.each(oldWidget['config'], function (key) {
            if (key !== 'dataInfos') {
                oldWidget['config'][key] = newWidget['config'][key];
                return true;
            }

            oldWidget['config'].dataInfos.splice(0);
            newWidget['config'].dataInfos.forEach(function (dataInfo) {
                oldWidget['config'].dataInfos.push(angular.copy(dataInfo));
            });
        });
    });
}

function isScopeDestroyed(scope) {
    while (scope) {
        if (scope.$$destroyed) {
            return true;
        }
        scope = scope.$parent;
    }

    return false;
}

function range(n, initValue) {
    var ret = [];

    for (var i = 0; i < n; i++) {
        ret[i] = initValue !== undefined ? initValue : 0;
    }

    return ret;
}

/************************** App modlue *****************************/

indexApp.value('gridLayerConfig', {number: 12});

indexApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                template: '<span class="load" ng-if="project && dashboard">Loading...</span>',
                controller: 'UrlCtrl'
            }).
            when('/projects/:project_id', {
                template: '',
                controller: 'UrlCtrl'
            }).
            when('/projects/:project_id/dashboards/:id?', {
                templateUrl: '/public/src/index.html',
                controller: 'IndexCtrl'
            }).
            when('/projects/:project_id/dashboards/:id/edit', {
                templateUrl: '/public/src/edit_layout.html',
                controller: 'editLayoutCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
]);

indexApp.controller('UrlCtrl', ['$scope', '$routeParams', '$location', '$q', 'Project', 'Dashboard',
    function ($scope, $routeParams, $location, $q, Project, Dashboard){
        $scope.dashboard = null;
        var projectPromise = null;

        $scope.$on('$routeChangeSuccess', function () {
            $scope.publicSelected = !!($routeParams.public_filter === undefined || $routeParams.public_filter === 'true' || $routeParams.public_filter === true);
            $scope.privateSelected = !!($routeParams.private_filter === undefined || $routeParams.private_filter === 'true' || $routeParams.private_filter === true);
        });

        if($routeParams.project_id){
            projectPromise = Project.get({
                id: parseInt($routeParams.project_id, 10)
            }).$promise.then(function (project){
                return project;
            });
        }
        else{
            projectPromise = Project.query().$promise.then(function (projects) {
                if (!projects || !projects.length) {
                    return [];
                }

                return projects[0];
            });
        }

        if(!projectPromise){
            return ;
        }

        projectPromise.then(function(project){
            Dashboard.query({
                project_id: project.id,
                public_filter: $scope.publicSelected,
                private_filter: $scope.privateSelected
            }).$promise.then(function (dashboards) {
                if(!dashboards || !dashboards.length) {
                    return ;
                }

                var url = '/projects/' + project.id + '/dashboards/' + dashboards[0].id;
                $location.path(url).search({
                    public_filter: $scope.publicSelected,
                    private_filter: $scope.privateSelected
                });
            });
        });
    }
]);

indexApp.controller('SlideCtrl', ['$scope', '$route', '$routeParams', '$window', '$q', '$location', '$interval', '$timeout', 'Dashboard', 'Project',
    function ($scope, $route, $routeParams, $window, $q, $location, $interval, $timeout, Dashboard, Project) {
        $scope.cfNavUnfold = false;
        $scope.project = null;
        $scope.dashboards = [];

        $scope.$on('$routeChangeSuccess', function () {
            var projectId = $routeParams.project_id ? parseInt($routeParams.project_id, 10) : null;
            var dashboardId = $routeParams.id ? parseInt($routeParams.id, 10) : null;

            $scope.publicSelected = !!($routeParams.public_filter === undefined || $routeParams.public_filter === 'true' || $routeParams.public_filter === true);
            $scope.privateSelected = !!($routeParams.private_filter === undefined || $routeParams.private_filter === 'true' || $routeParams.private_filter === true);

            var projectsPromise = Project.query().$promise;

            var projectPromise = projectsPromise.then(function (projects) {
                $scope.projects = projects;

                if(!projectId){
                    return $scope.projects.length ? $scope.projects[0] : null;
                }
                else{
                    return Project.get({
                        id: projectId
                    }).$promise;
                }
            });

           var dashboardsPromise = projectPromise.then(function (project) {
                $scope.project = project;

                if(!project){
                    return [];
                }

                return Dashboard.query({
                    project_id: project.id,
                    public_filter: $scope.publicSelected,
                    private_filter: $scope.privateSelected
                }).$promise;
            });

            var dashboardPromise = dashboardsPromise.then(function (dashboards) {
                $scope.dashboards = dashboards;

                if(!dashboardId) {
                    return dashboards[0];
                }

                return Dashboard.get({
                    id: dashboardId
                }).$promise;
            });

            dashboardPromise.then(function (dashboard) {
                $scope.dashboard = dashboard;
            });
        });

        var SLIDE_INTERVAL_TIME = 600000;
        var PHASE_DELAY_TIME = 1000 + 1500;
        var PHASE_COUNT = 10;

        //slide
        $scope.slideMode = false;

        //slide
        function doSlide() {
            if(!$scope.dashboards || $scope.dashboards.length === 0){
                return ;
            }

            var currentDashboardIdx = null;

            $scope.dashboards.some(function (dashboard, idx) {
                if (dashboard.id === $scope.dashboard.id) {
                    currentDashboardIdx = idx;
                    return true;
                }
            });

            currentDashboardIdx = (currentDashboardIdx + 1) % $scope.dashboards.length;

            var newUrl = '/projects/' + $scope.project.id + '/dashboards/' + $scope.dashboards[currentDashboardIdx].id;
            $location.path(newUrl).search({
                public_filter: $scope.publicSelected,
                private_filter: $scope.privateSelected
            });

            stopPhaseTimer();
            startPhaseDelayTimer();
        }

        // delay phase run
        var phaseDelayTimer = null;

        function startPhaseDelayTimer() {
            stopPhaseDelayTimer();

            phaseDelayTimer = $timeout(startPhaseTimer, PHASE_DELAY_TIME);
        }

        function stopPhaseDelayTimer() {
            if (phaseDelayTimer !== null) {
                $timeout.cancel(phaseDelayTimer);
                phaseDelayTimer = null;
            }
        }

        //timer for next slide
        $scope.phase = 0;

        // phase counter
        var phaseTimer = null;
        //timer for next slide
        function startPhaseTimer() {
            stopPhaseTimer();

            $scope.phase = 0;

            phaseTimer = $interval(function () {
                $scope.phase += 1;
            }, (SLIDE_INTERVAL_TIME - PHASE_DELAY_TIME) / PHASE_COUNT);
        }

        function stopPhaseTimer() {
            if (phaseTimer) {
                $interval.cancel(phaseTimer);
                phaseTimer = null;
            }

            $scope.phase = -1;
        }

        // control dashboard slide interval
        var slideTimer = null;
        //check if go into auto slide Mode
        function startSlide() {
            stopSlide();

            $scope.slideMode = true;

            slideTimer = $interval(doSlide, SLIDE_INTERVAL_TIME);

            doSlide();  //call once
        }

        function stopSlide() {
            if (slideTimer) {
                $interval.cancel(slideTimer);
                slideTimer = null;
            }

            $scope.slideMode = false;
        }

        $scope.startSlide = startSlide;
        $scope.stopSlide = stopSlide;

        $scope.$on('$destroy', function () {
            stopSlide();
            stopPhaseTimer();
            stopPhaseDelayTimer();
        });

        //bind nav.unfold event
        function navUnfoldHandler (evt, value) {
            $scope.cfNavUnfold = value;
            $timeout(function(){
                $(window).trigger('resize');
            }, 310);    //transition-duration + 10ms
        }

        $(window).on('nav.unfold', navUnfoldHandler);

        $scope.$on('add.dashboards', function (evt, dashboard){
            var newUrl = '/projects/' + $scope.project.id + '/dashboards/' + dashboard.id;

            $location.path(newUrl).search({
                public_filter: $scope.publicSelected,
                private_filter: $scope.privateSelected
            });
        });

        $scope.$on('$destroy', function () {
            $(window).off('nav.unfold', navUnfoldHandler);
        });
    }
]);

indexApp.controller('NavCtrl', ['$scope', '$route', '$routeParams', '$q', '$location', '$window', 'Dashboard', 'Project', 'NavUrl', 'CurrentUser', 'UserRole', 'Role',
    function ($scope, $route, $routeParams, $q, $location, $window, Dashboard, Project, NavUrl, CurrentUser, UserRole, Role) {
        $scope.unfold = false;
        $scope.editLayoutMode = false;
        $scope.NavUrl = NavUrl;

        CurrentUser.get()
            .$promise.then(function (user){
                $scope.user = user;

                return UserRole.query({
                    user_id: user.id
                }).$promise;
            })
            .then(function (userRoles){
                if(!userRoles || userRoles.length === 0){
                    return false;
                }

                return Role.get({
                    id: userRoles[0].role_id
                }).$promise;
            })
            .then(function (role){
                if(!role){
                    return false;
                }

                $scope.user.scope = role.scope;
            });

        var lastProjectId = null;

        function init(evt) {
            // ignore element resize event
            if (evt.target !== undefined) {
                return;
            }

            $scope.publicSelected = !!($routeParams.public_filter === undefined || $routeParams.public_filter === 'true' || $routeParams.public_filter === true);
            $scope.privateSelected = !!($routeParams.private_filter === undefined || $routeParams.private_filter === 'true' || $routeParams.private_filter === true);

            var projectId = $routeParams.project_id ? parseInt($routeParams.project_id, 10) : null;
            var dashboardId = $routeParams.id ? parseInt($routeParams.id, 10) : null;

            var projectsPromise = Project.query().$promise;

            var projectPromise = projectsPromise.then(function (projects) {
                $scope.projects = projects;

                if(!projectId){
                    return $scope.projects.length ? $scope.projects[0] : null;
                }
                else{
                    return Project.get({
                        id: projectId
                    }).$promise;
                }
            });

            var dashboardsPromise = projectPromise.then(function (project) {
                $scope.project = project;

                if(!project){
                    return [];
                }

                return Dashboard.query({
                    project_id: project.id,
                    public_filter: $scope.publicSelected,
                    private_filter: $scope.privateSelected
                }).$promise;
            });

            var dashboardPromise = dashboardsPromise.then(function (dashboards) {
                if(!$scope.dashboards || projectId !== lastProjectId || dashboards.length !== $scope.dashboards.length) {
                    $scope.dashboards = dashboards;
                }

                if(!dashboardId) {
                    return dashboards[0];
                }

                return Dashboard.get({
                    id: dashboardId
                }).$promise;
            });

            dashboardPromise.then(function (dashboard) {
                $scope.dashboard = dashboard;
                lastProjectId = projectId;
            });

            $scope.editLayoutMode = $route.current.$$route ? $route.current.$$route.controller === 'editLayoutCtrl' : false;
        }

        angular.element($window).bind('resize', init);
        $scope.$on('$routeChangeSuccess', init);

        $scope.toggleSlideMode = function () {
            if($scope.slideMode){
                $scope.stopSlide();
            }
            else{
                $scope.startSlide();
            }
        };

        $scope.toggleEditLayoutMode = function () {
            if(!$scope.project || !$scope.dashboard){
                return ;
            }

            $scope.editLayoutMode = !$scope.editLayoutMode;

            var newUrl = '/projects/' + $scope.project.id + '/dashboards/' + $scope.dashboard.id + ($scope.editLayoutMode ? '/edit' : '');
            $location.path(newUrl).search({
                public_filter: $scope.publicSelected,
                private_filter: $scope.privateSelected
            });
        };

        $scope.setUnfold = function (value) {
            $scope.unfold = value;
            $(window).trigger('nav.unfold',  [value ]);
        };

        $scope.selectProject = function (project) {
            $scope.project = project;

            Dashboard.query({
                project_id: project.id,
                public_filter: $scope.publicSelected,
                private_filter: $scope.privateSelected
            }).$promise.then(function (dashboards) {
                $scope.dashboard = dashboards && dashboards.length ? dashboards[0] : null;

                var newUrl = '/projects/' + $scope.project.id + '/dashboards/' + ( $scope.dashboard ? $scope.dashboard.id : '' );
                $location.path(newUrl).search({
                    public_filter: $scope.publicSelected,
                    private_filter: $scope.privateSelected
                });
            });
        };

        $scope.togglePublicSelection = function () {
            $location.path('/projects/' + $scope.project.id).search({
                public_filter: !$scope.publicSelected,
                private_filter: $scope.privateSelected
            });
        };

        $scope.togglePrivateSelection = function () {
            $location.path('/projects/' + $scope.project.id).search({
                public_filter: $scope.publicSelected,
                private_filter: !$scope.privateSelected
            });
        };
    }
]);

indexApp.controller('IndexCtrl', ['$scope', '$q', '$window', '$routeParams', '$interval', 'Dashboard', 'Project', 'Widget', 'widgetUrl',
    function ($scope, $q, $window, $routeParams, $interval, Dashboard, Project, Widget, widgetUrl) {
        var projectId = $routeParams.project_id ? parseInt($routeParams.project_id, 10) : null;
        var dashboardId = $routeParams.id ? parseInt($routeParams.id, 10) : null;
        $scope.publicSelected = !!($routeParams.public_filter === undefined || $routeParams.public_filter === 'true' || $routeParams.public_filter === true);
        $scope.privateSelected = !!($routeParams.private_filter === undefined || $routeParams.private_filter === 'true' || $routeParams.private_filter === true);

        $scope.projects = Project.query();

        $scope.project = $q.when($scope.projects).then(function (projects) {
            $scope.projects = projects;

            if(!projectId){
                return $scope.projects.length ? $scope.projects[0] : null;
            }
            else{
                return Project.get({
                    id: projectId
                }).$promise;
            }
        });

        $scope.dashboards = $scope.project.then(function (project) {
            $scope.project = project;

            if(!project){
                return [];
            }

            return Dashboard.query({
                project_id: project.id,
                public_filter: $scope.publicSelected,
                private_filter: $scope.privateSelected
            }).$promise;
        });

        $scope.dashboard = $scope.dashboards.then(function (dashboards) {
            $scope.dashboards = dashboards;

            if(dashboards.length === 0){
                return null;
            }

            if(!dashboardId) {
                return dashboards[0];
            }

            return Dashboard.get({
                id: dashboardId
            }).$promise;
        });

        $scope.widgets = $scope.dashboard.then(function (dashboard) {
            $scope.dashboard = dashboard;

            if (!dashboard || !dashboard.config || !dashboard.config.layout) {
                return [];
            }

            $scope.widgetLayer = $scope.dashboard.config.layout.map(function (widgetLayout) {
                return {
                    id: widgetLayout.id,
                    x: widgetLayout.first_grid[0],
                    y: widgetLayout.first_grid[1],
                    w: widgetLayout.last_grid[1] - widgetLayout.first_grid[1] + 1,
                    h: widgetLayout.last_grid[0] - widgetLayout.first_grid[0] + 1
                };
            });

            return Widget.query({
                dashboardid: dashboard.id
            }).$promise.then(function (widgets) {
                return widgets;
            });
        });

        $q.when($scope.widgets).then(function (widgets) {
            widgets = widgets || [];
            $scope.widgets = widgets.reduce(function (memo, curr) {
                memo[curr.id] = curr;
                return memo;
            }, {});
        });
    }
]);

indexApp.controller('editLayoutCtrl', ['$scope', '$window', '$routeParams', '$location', '$interval', 'Project', 'Dashboard', 'Widget', '$q', 'gridLayerConfig',
    function ($scope, $window, $routeParams, $location, $interval, Project, Dashboard, Widget, $q, gridLayerConfig) {
        $scope.gridLayer = gridLayer;
        $scope.addedControllers = [];
        $scope.gridLayerStatus = [];

        $scope.$on('$routeChangeSuccess', function () {
            $scope.publicSelected = !!($routeParams.public_filter === undefined || $routeParams.public_filter === 'true' || $routeParams.public_filter === true);
            $scope.privateSelected = !!($routeParams.private_filter === undefined || $routeParams.private_filter === 'true' || $routeParams.private_filter === true);
        });

        var projectId = $routeParams.project_id ? parseInt($routeParams.project_id, 10) : null;
        var dashboardId = $routeParams.id ? parseInt($routeParams.id, 10) : null;

        $scope.projects = Project.query();

        $scope.project = Project.get({
           id: projectId
        });

        $scope.dashboards = Dashboard.query({
            project_id: projectId,
            public_filter: $scope.publicSelected,
            private_filter: $scope.privateSelected
        });

        $scope.dashboard = Dashboard.get({
            id: dashboardId
        }).$promise.then(function (dashboard) {
            return dashboard;
        });

        function matchSameSegment(seg, cmpRow) {
            var ret = null;

            cmpRow.some(function (cmpSeg, idx) {
                if (cmpSeg[0] > seg[0]) {
                    return true;
                }
                if (cmpSeg[0] === seg[0] && cmpSeg[1] === seg[1]) {
                    ret = idx;
                    return true;
                }
            });

            return ret;
        }

        // scan unused grid segmemt of each row
        function scanGrids(grids) {
            var rowCount = grids.length;
            var colCount = grids[0].length;
            var ret = [];

            for (var i = 0; i < rowCount; i++) {
                ret[i] = [];
                var start = null, end = null;
                for (var j = 0; j < colCount; j++) {
                    if (!grids[i][j] && start === null) {
                        start = j;
                    }
                    else if (grids[i][j] && start !== null) {
                        end = j - 1;
                        ret[i].push([start, end]);

                        start = null;
                        end = null;
                    }
                }

                if (start !== null) {
                    ret[i].push([start, colCount - 1]);
                }
            }

            return ret;
        }

        //split unused grid to controllers
        $scope.calculateAddedControllers = function (gridLayerStatus) {
            if (!gridLayerStatus || gridLayerStatus.length <= 0 || gridLayerStatus[0].length <= 0) {
                return [];
            }
            var validGridSegments = scanGrids(gridLayerStatus);
            var result = [];

            validGridSegments.forEach(function (row, rowIdx) {
                row.forEach(function (seg) {
                    var w = seg[1] - seg[0] + 1;
                    var h = 1;  //at least 1 row

                    validGridSegments.some(function (cmpRow, cmpRowIdx) {
                        if (cmpRowIdx <= rowIdx) {
                            return false;
                        }

                        var ret = matchSameSegment(seg, cmpRow);
                        if (ret !== null) {
                            h = cmpRowIdx - rowIdx + 1;
                            validGridSegments[cmpRowIdx].splice(ret, 1);
                        }
                        else {
                            return true;
                        }
                    });

                    result.push({
                        id: null,
                        x: rowIdx,
                        y: seg[0],
                        w: w,
                        h: h
                    });
                });

                validGridSegments[rowIdx] = [];
            });

            return result;
        };

        $scope.initGridLayerStatus = function (dashboardLayout) {
            //init grids status
            var gridLayerStatus = range(12, false).map(range.bind(null, 12, false));

            dashboardLayout.forEach(function (widgetLayout) {
                for (var i = widgetLayout.first_grid[0]; i <= widgetLayout.last_grid[0]; i++) {
                    for (var j = widgetLayout.first_grid[1]; j <= widgetLayout.last_grid[1]; j++) {
                        gridLayerStatus[i][j] = true;
                    }
                }
            });

            return gridLayerStatus;
        };

        $scope.widgets = $q.when($scope.dashboard).then(function (dashboard) {
            if (dashboard === null) {
                return [];
            }

            $scope.dashboard = dashboard;

            return Widget.query({
                dashboardid: dashboard.id
            }).$promise.then(function (widgets) {
                    return widgets;
                });
        });

        $q.when($scope.widgets).then(function (widgets) {
            if (!$scope.dashboard.config || !$scope.dashboard.config.layout) {
                return;
            }

            //init widget layer
            $scope.widgetLayer = $scope.dashboard.config.layout.map(function (widgetLayout) {
                return {
                    id: widgetLayout.id,
                    x: widgetLayout.first_grid[0],
                    y: widgetLayout.first_grid[1],
                    w: widgetLayout.last_grid[1] - widgetLayout.first_grid[1] + 1,
                    h: widgetLayout.last_grid[0] - widgetLayout.first_grid[0] + 1
                };
            });

            //init controller layer
            $scope.gridLayerStatus = $scope.initGridLayerStatus($scope.dashboard.config.layout);
            $scope.addedControllers = $scope.calculateAddedControllers($scope.gridLayerStatus);

            widgets = widgets || [];
            $scope.widgets = widgets.reduce(function (memo, curr) {
                memo[curr.id] = curr;
                return memo;
            }, {});
        });


        /**************** public funcs *******************/
        function conflictTest(newController, oldController, gridLayerStatus) {
            if (newController.x < 0 || newController.y < 0 || newController.x + newController.h > gridLayerConfig.number || newController.y + newController.w > gridLayerConfig.number) {
                return true;
            }

            for (var i = newController.x; i < newController.x + newController.h; i++) {
                for (var j = newController.y; j < newController.y + newController.w; j++) {
                    var gridObj = {
                        x: i,
                        y: j
                    };

                    if (!isValidGrid(gridObj, gridLayerStatus) && !isGridBelongToController(gridObj, oldController)) {
                        return true;
                    }
                }
            }
            return false;
        }

        function resizeAll(newController, oldController, scope) {
            if (!$scope.dashboard.config || !$scope.dashboard.config.layout) {
                return;
            }

            //save
            $scope.dashboard.config.layout.forEach(function (widgetLayout) {
                if (widgetLayout.id === newController.id) {
                    widgetLayout.first_grid = [newController.x, newController.y];
                    widgetLayout.last_grid = [newController.x + newController.h - 1, newController.y + newController.w - 1];
                }
            });

            Dashboard.update({
                id: $scope.dashboard.id
            }, $scope.dashboard);

            //update gridLayerStatus
            for (var i = oldController.x; i < oldController.x + oldController.h; i++) {
                for (var j = oldController.y; j < oldController.y + oldController.w; j++) {
                    scope.gridLayerStatus[i][j] = false;
                }
            }
            for (var m = newController.x; m < newController.x + newController.h; m++) {
                for (var n = newController.y; n < newController.y + newController.w; n++) {
                    scope.gridLayerStatus[m][n] = true;
                }
            }

            angular.element.each(newController, function (key) {
                oldController[key] = newController[key];
            });

            //resize controllers
            scope.addedControllers = scope.calculateAddedControllers(scope.gridLayerStatus);

            //resize widgets
            scope.widgetLayer.some(function (widgetLayout) {
                if (widgetLayout.id === oldController.id) {
                    angular.element.each(oldController, function (key) {
                        widgetLayout[key] = oldController[key];
                    });
                }
            });

            scope.$apply();
            scope.$broadcast('widgetlayoutchange', {
                id: oldController.id
            });
        }

        /************************ resize ***********************/

            //check if grids[x][y] is a valid grid
        function isValidGrid(gridObj, grids) {
            return grids[gridObj.x][gridObj.y] === false;
        }

        //check if grids[x][y] is controller's grid
        function isGridBelongToController(gridObj, controller) {
            var x = gridObj.x;
            var y = gridObj.y;

            return ( x >= controller.x && x < (controller.x + controller.h) ) && ( y >= controller.y && y < ( controller.y + controller.w ) );
        }

        $scope.adjustResize = function (newController, oldController) {
            //if no change happen
            if (newController.x === oldController.x && newController.y === oldController.y && newController.w === oldController.w && newController.h === oldController.h) {
                return;
            }

            //if width < 1 or height < 1
            if (newController.w === 0 || newController.h === 0) {
                return;
            }

            //if conflict
            if (conflictTest(newController, oldController, $scope.gridLayerStatus)) {
                return;
            }

            resizeAll(newController, oldController, $scope);
        };

        /*************** drag ****************/
        $scope.adjustDrag = function (newController, oldController) {
            //if no change happen
            if (newController.x === oldController.x && newController.y === oldController.y && newController.w === oldController.w && newController.h === oldController.h) {
                return;
            }

            if (conflictTest(newController, oldController, $scope.gridLayerStatus)) {
                return;
            }
            else {
                resizeAll(newController, oldController, $scope);
            }
        };

        $scope.stopDrag = function () {

        };

        $scope.cancelLayoutEdit = function () {
            var newUrl = '/dashboards/' + $scope.dashboard.id;
            $location.path(newUrl);
        };

        $scope.$on('deleteWidget', function(evt, controller){
            var widgetId = controller.id;

            // delete widget info in dashboard
            var deleteComplete = $scope.dashboard.config.layout.some(function (widgetLayout, idx) {
                if (widgetLayout.id === widgetId) {
                    $scope.dashboard.config.layout.splice(idx, 1);
                    return true;
                }
            });

            // update dashboard
            if(deleteComplete){
                Dashboard.update({
                    id: $scope.dashboard.id
                }, $scope.dashboard).$promise.then(function () {
                    //update widgets
                    Object.keys($scope.widgets).forEach(function (key) {
                        if (key === widgetId) {
                            delete $scope.widgets[key];
                        }
                    });

                    //update controllers
                    $scope.widgetLayer.some(function (widgetLayout, idx) {
                        if (widgetLayout.id === widgetId) {
                            $scope.widgetLayer.splice(idx, 1);
                            return true;
                        }
                    });

                    for (var i = controller.x; i < controller.x + controller.h; i++) {
                        for (var j = controller.y; j < controller.y + controller.w; j++) {
                            $scope.gridLayerStatus[i][j] = false;
                        }
                    }
                    $scope.addedControllers.splice(0);
                    $scope.calculateAddedControllers($scope.gridLayerStatus).forEach(function (addedController) {
                        $scope.addedControllers.push(addedController);
                    });
                });
            }
        });
    }
]);

indexApp.controller('EditWidgetModalCtrl', ['$scope', '$q', '$modal',
    function ($scope, $q, $modal) {
        var $outerScope = $scope;
        var newWidgetModalInstanceCtrl = ['$scope', '$rootScope', '$q', 'Widget', 'DataSource', 'Dashboard', 'Folder', 'SubFolder', '$modalInstance', 'dashboard', 'controller',
            function ($scope, $rootScope, $q, Widget, DataSource, Dashboard, Folder, SubFolder, $modalInstance, dashboard, controller) {
                $scope.dashboard = dashboard;
                $scope.widgetTypes = widgetTypes;
                $scope.addedDataInfo = {};
                $scope.dataSourceType = {
                    single: true,
                    multi: false
                };

                function formatWidget(widget) {
                    //add new widget
                    if (!widget) {
                        return $q.when({
                            dashboard_id: dashboard.id,
                            config: {
                                dataInfos: [
                                    {
                                        id: null
                                    }
                                ]
                            }
                        });
                    }

                    widget.config.dataInfos = widget.config.dataInfos || [];

                    //widget without dataSource
                    if (widget.config.dataInfos.length === 0) {
                        widget.config.dataInfos.push({
                            id: null
                        });
                        return $q.when(widget);
                    }

                    var promises = widget.config.dataInfos.map(function (dataInfo) {
                        return DataSource.get({
                            id: dataInfo.id
                        }).$promise.then(function (ds) {

                                //add dimension info: in dataSource config, but missed in widget.config.dataInfos
                                if (ds.config.dimensions && dataInfo.dimensions && ds.config.dimensions.length > dataInfo.dimensions.length) {
                                    ds.config.dimensions.forEach(function (dim) {
                                        var flag = dataInfo.dimensions.some(function (dimension) {
                                            if (dim.key === dimension.key) {
                                                return true;
                                            }
                                        });

                                        if (!flag) {
                                            dataInfo.dimensions.push({
                                                key: dim.key,
                                                name: dim.name,
                                                value: ''
                                            });
                                        }
                                    });
                                }
                                return ds;
                            });
                    });

                    return $q.all(promises).then(function () {
                        return widget;
                    });
                }

                if (!controller.id) {
                    formatWidget(null).then(function (widget) {
                        $scope.widget = widget;
                    });
                } else {
                    Widget.get({
                        dashboardid: dashboard.id,
                        id: controller.id
                    }).$promise.then(function (widget) {
                            if (widget.type === 1 || widget.type === 2 || widget.type === 5) {
                                if (widget.config.dataInfos && widget.config.dataInfos.length > 1) {
                                    $scope.dataSourceType.multi = true;
                                    $scope.dataSourceType.single = !$scope.dataSourceType.multi;
                                }
                            }

                            formatWidget(widget).then(function (widget) {
                                $scope.widget = widget;
                            });
                        });
                }

                DataSource.query().$promise.then(function (dataSources) {
                    $scope.dataSources = dataSources;
                    $scope.dataSourceMap = angular.copy(dataSources).reduce(function (memo, curr) {
                        memo[curr.id] = curr;
                        return memo;
                    }, {});
                });

                $scope.addDataInfo = function () {
                    $scope.widget.config.dataInfos.push({
                        id: null
                    });
                };

                $scope.deleteDataInfo = function (dataInfo) {
                    var idx = $scope.widget.config.dataInfos.indexOf(dataInfo);
                    if (idx === -1) {
                        return;
                    }
                    $scope.widget.config.dataInfos.splice(idx, 1);

                    //if no dataSource, add a null dataSource
                    if ($scope.widget.config.dataInfos.length === 0) {
                        $scope.widget.config.dataInfos.push({
                            id: null
                        });
                    }
                };

                $scope.ok = function () {
                    $scope.errorDataSources = [];
                    var dataInfos = $scope.widget.config.dataInfos;
                    var widgetType = $scope.widget.type;

                    if ($scope.dataSourceType.single) {
                        dataInfos.splice(1);
                    }

                    //if only a null dataSource
                    if (dataInfos.length === 1 && !dataInfos[0].id) {
                        dataInfos.splice(0);
                    }

                    //check dimension.value && id
                    var i = null;
                    for(i = dataInfos.length - 1; i >= 0 ; i--){
                        if(!dataInfos[i].id) {
                            dataInfos.splice(i, 1);
                            continue;
                        }

                        if (!dataInfos[i].dimensions) {
                            continue;
                        }

                        dataInfos[i].dimensions.forEach(function (dimension) {
                            if (!dimension.value || dimension.value === '' || dimension.value === 'ignore') {
                                if (dimension.value === 'ignore' && (widgetType === 1 || widgetType === 2 || widgetType === 5) && dataInfos.length === 1) {
                                    return;
                                }

                                $scope.errorDataSources.push(dimension.name);
                            }
                        });
                    }

                    if ($scope.errorDataSources.length) {
                        return;
                    }

                    if (!controller.id) {
                        Widget.save({
                            dashboardid: $scope.dashboard.id
                        }, $scope.widget).$promise.then(function (widget) {

                            $outerScope.widgets[widget.id] = widget;

                            //update dashboard
                            $scope.dashboard.config = $scope.dashboard.config || {};
                            $scope.dashboard.config.layout = $scope.dashboard.config.layout || [];

                            $scope.dashboard.config.layout.push({
                                id: widget.id,
                                first_grid: [controller.x, controller.y],
                                last_grid: [controller.x + controller.h - 1, controller.y + controller.w - 1]
                            });

                            Dashboard.update({
                                id: $scope.dashboard.id
                            }, $scope.dashboard);

                            //update layout view
                            $outerScope.widgetLayer.push({
                                id: widget.id,
                                x: controller.x,
                                y: controller.y,
                                w: controller.w,
                                h: controller.h
                            });

                            //update grids' status
                            for (var i = controller.x; i < controller.x + controller.h; i++) {
                                for (var j = controller.y; j < controller.y + controller.w; j++) {
                                    $outerScope.gridLayerStatus[i][j] = true;
                                }
                            }

                            //delete controller from addedControllers
                            var idx = $outerScope.addedControllers.indexOf(controller);
                            $outerScope.addedControllers.splice(idx, 1);

                            $modalInstance.close();
                        });
                    }
                    else {
                        Widget.update({
                            dashboardid: $scope.dashboard.id,
                            id: $scope.widget.id
                        }, $scope.widget).$promise.then(function (widget) {
                                //update widgets
                                angular.element.each($outerScope.widgets, function (id) {
                                    if (parseInt(id, 10) === widget.id) {
                                        copyWidget($outerScope.widgets[id], widget);
                                    }
                                });

                                $rootScope.$broadcast('widgetupdate', {
                                    id: widget.id
                                });
                                $modalInstance.close();
                            });
                    }
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }
        ];

        $scope.open = function (controller) {
            var newWidgetModalInstance = $modal.open({
                templateUrl: '/public/src/include/widget_edit_modal.html',
                controller: newWidgetModalInstanceCtrl,
                resolve: {
                    dashboard: function () {
                        return $scope.dashboard;
                    },
                    controller: function () {
                        return controller;
                    }
                }
            });
        };
    }
]);

indexApp.controller('folderMenuNodeCtrl', ['$scope', 'SubFolder', 'DataSource',
    function ($scope, SubFolder, DataSource) {
        $scope.treeWrapper = {
            folders: [],
            dataSources: []
        };

        $scope.treeWrapper.folders = $scope.folder.id > 0 ? SubFolder.query({
            parent_id: $scope.folder.id,
            project_id: $scope.projectId
        }) : [];

        $scope.treeWrapper.dataSources = $scope.folder.id > 0 ? DataSource.query({
            folder_id: $scope.folder.id,
            project_id: $scope.projectId
        }) : [];
    }
]);

indexApp.controller('EditDashboardModalCtrl', ['$scope', '$modal',
    function ($scope, $modal) {
        var newDashboardModalInstanceCtrl = ['$scope', '$rootScope', 'Dashboard', '$modalInstance', 'dashboards', 'dashboard', 'projectId',
            function ($scope, $rootScope, Dashboard, $modalInstance, dashboards, dashboard, projectId) {
                $scope.dashboard = dashboard ? dashboard : {
                    project_id: projectId,
                    config: {
                        layout: []
                    }
                };

                $scope.dashboard.private = $scope.dashboard.private ? $scope.dashboard.private : false;
                var backupDashboardName = dashboard ? dashboard.name : null;

                $scope.ok = function () {
                    if (dashboard) {
                        Dashboard.update({
                            id: $scope.dashboard.id
                        }, $scope.dashboard);
                    }
                    else {
                        Dashboard.save($scope.dashboard).$promise.then(function (id) {
                            Dashboard.get(id).$promise.then(function (dashboard) {
                                dashboards.push(dashboard);
                                $rootScope.$broadcast('add.dashboards', dashboard);
                            });
                        });
                    }
                    $modalInstance.close();
                };

                $scope.cancel = function () {
                    $scope.dashboard.name = dashboard ? backupDashboardName : $scope.dashboard.name;

                    $modalInstance.dismiss('cancel');
                };
            }
        ];

        $scope.open = function (projectId, dashboard) {
            var newWidgetModalInstance = $modal.open({
                templateUrl: '/public/src/include/dashboard_edit_modal.html',
                controller: newDashboardModalInstanceCtrl,
                resolve: {
                    dashboards: function () {
                        return $scope.dashboards;
                    },
                    dashboard: function () {
                        return dashboard ? dashboard : null;
                    },
                    projectId: function () {
                        return projectId;
                    }
                }
            });
        };
    }
]);

indexApp.controller('ConfirmDeleteDashboardCtrl', ['$scope', '$modal',
    function ($scope, $modal) {
        var confirmDeleteDashboardModalInstanceCtrl = ['$scope', '$rootScope', '$location', '$q', 'Dashboard', 'Widget', '$modalInstance', 'dashboards', 'projectId', 'dashboard',
            function ($scope, $rootScope, $location, $q, Dashboard, Widget, $modalInstance, dashboards, projectId, dashboard) {
                $scope.dashboard = dashboard;

                $scope.ok = function () {
                    var promises = Widget.query({
                        dashboardid: $scope.dashboard.id
                    }).$promise.then(function (widgets) {
                            return widgets.map(function (widget) {
                                return Widget.delete({
                                    dashboardid: $scope.dashboard.id,
                                    id: widget.id
                                }).$promise.then(function (ret) {
                                        return ret;
                                    });
                            });
                        });

                    $q.all(promises).then(function (results) {
                        Dashboard.delete({
                            id: $scope.dashboard.id
                        }).$promise.then(function () {
                            var idx = dashboards.indexOf($scope.dashboard);
                            if (idx === -1) {
                                $modalInstance.close();
                            }
                            dashboards.splice(idx, 1);

                            //change url to other dashboard
                            var newUrl = '/projects/' + projectId + '/dashboards';
                            if(dashboards.length){
                                newUrl += '/' + (idx !== dashboards.length ? dashboards[idx].id : dashboards[idx - 1].id);
                            }
                            $location.path(newUrl);

                            $modalInstance.close();
                        });
                    });
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }
        ];

        $scope.open = function (projectId, dashboard) {
            var newWidgetModalInstance = $modal.open({
                templateUrl: '/public/src/include/confirm_delete_modal.html',
                controller: confirmDeleteDashboardModalInstanceCtrl,
                resolve: {
                    dashboards: function () {
                        return $scope.dashboards;
                    },
                    projectId: function () {
                        return projectId;
                    },
                    dashboard: function () {
                        return dashboard;
                    }
                }
            });
        };
    }
]);

indexApp.controller('EditProjectModalCtrl', ['$scope', '$location', '$modal',
    function ($scope, $location, $modal) {
        var newDashboardModalInstanceCtrl = ['$scope', '$rootScope', 'Project', '$modalInstance', 'projects', 'project',
            function ($scope, $rootScope, Project, $modalInstance, projects, project) {
                $scope.project = project ? project : {};

                var backupProjectName = project ? project.name : null;

                $scope.ok = function () {
                    if (project) {
                        Project.update({
                            id: $scope.project.id
                        }, $scope.project);
                    }
                    else {
                        Project.save($scope.project).$promise.then(function (id) {
                            Project.get(id).$promise.then(function (proj) {
                                var newUrl = '/projects/' + proj.id + '/dashboards/';

                                $location.path(newUrl).search({
                                    public_filter: $scope.publicSelected,
                                    private_filter: $scope.privateSelected
                                });
                            });
                        });
                    }

                    $modalInstance.close();
                };

                $scope.cancel = function () {
                    $scope.project.name = project ? backupProjectName : $scope.project.name;

                    $modalInstance.dismiss('cancel');
                };
            }
        ];

        $scope.open = function (projects, project) {
            var newWidgetModalInstance = $modal.open({
                templateUrl: '/public/src/include/project_edit_modal.html',
                controller: newDashboardModalInstanceCtrl,
                resolve: {
                    projects: function () {
                        return projects;
                    },
                    project: function () {
                        return project ? project : null;
                    }
                }
            });
        };
    }
]);

indexApp.directive('eatClick', [
    function () {
        return {
            restrict: 'A',
            scope: {
                tabMode: '=tabMode',
                mode: '=mode'
            },
            link: function ($scope, $elem) {
                angular.element($elem).click(function (evt) {
                    evt.preventDefault();
                    $scope.mode = $scope.tabMode;
                });
            }
        };
    }
]);

indexApp.directive('resizeable', ['gridLayerConfig',
    function (gridLayerConfig) {
        return {
            restrict: 'A',
            scope: {
                resizableConfig: '=',
                controller: '=',
                adjustResize: '='
            },
            link: function ($scope, $elem) {
                function resize() {
                    var newW = Math.round($(this).width() / $(this).parents('.layer').width() * gridLayerConfig.number);
                    var newH = Math.round($(this).height() / $(this).parents('.layer').height() * gridLayerConfig.number);

                    var newController = {
                        id: $scope.controller.id,
                        w: newW,
                        h: newH,
                        x: $scope.controller.x,
                        y: $scope.controller.y
                    };

                    $scope.adjustResize(newController, $scope.controller);
                }

                function resizeStop() {
                    //clear css style
                    $(this).removeAttr('style');
                }

                $elem.resizable($scope.resizableConfig);
                $elem.on('resize', resize);
                $elem.on('resizestop', resizeStop);

                $scope.$on('$destroy', function () {
                    $elem.off('resize', resize);
                    $elem.off('resizestop', resizeStop);
                });
            }
        };
    }
]);

indexApp.directive('draggable', ['gridLayerConfig',
    function (gridLayerConfig) {
        return {
            restrict: 'A',
            scope: {
                adjustDrag: '=',
                stopDrag: '=',
                controller: '='
            },
            link: function ($scope, $elem) {
                var $dragElement = $elem.parent();

                function drag() {
                    var newX = Math.round($(this).position().top / $(this).parents('.layer').height() * gridLayerConfig.number);
                    var newY = Math.round($(this).position().left / $(this).parents('.layer').width() * gridLayerConfig.number);

                    var newController = {
                        id: $scope.controller.id,
                        w: $scope.controller.w,
                        h: $scope.controller.h,
                        x: newX,
                        y: newY
                    };

                    $scope.adjustDrag(newController, $scope.controller);
                }

                function dragStop() {
                    $scope.stopDrag();

                    //clear css style
                    $(this).removeAttr('style');
                }

                $dragElement.draggable({
                    handle: '.drag-inner-wrapper',
                    cursor: 'move',
                    scroll: false
                });
                $dragElement.on('drag', drag);
                $dragElement.on('dragstop', dragStop);

                $scope.$on('$destroy', function () {
                    $dragElement.off('drag', drag);
                    $dragElement.off('dragstop', dragStop);
                });
            }
        };
    }
]);

indexApp.directive('splitRow', [
    function () {
        return {
            restrict: 'A',
            scope: {
                rowCount: '=rowCount'
            },
            link: function ($scope, $elem) {
                var $row = $($elem);

                function resize() {
                    var parentHeight = $row.parent().height();
                    $row.height(parentHeight / $scope.rowCount);
                }

                resize();
                $(window).on('resize', resize);

                $scope.$on('$destroy', function () {
                    $(window).off('resize', resize);
                });
            }
        };
    }
]);

indexApp.directive('fitText', [
    function () {
        return {
            restrict: 'A',
            scope: {
                compressor: '=compressor'
            },
            link: function ($scope, $elem) {
                var compressor = $scope.compressor || 1;
                var $this = $elem;
                var $parentDiv = $this;
                var $parentSpan = $this.find('.metric span');

                var resizer = function () {
                    var minSideLength = Math.min($this.width(), $this.height());
                    var size = compressor * Math.sqrt(minSideLength);

                    //less than parent's width and height
                    size = size > minSideLength ? minSideLength: size;

                    $this.css('font-size', size);
                    $this.css('line-height', $this.css('font-size'));

                    //adjust width
                    if($parentSpan.length === 0){
                        $parentSpan = $this.find('.metric-small span');
                    }

                    while(1){
                        var maxWidth = $parentDiv.width();
                        var curWidth = $parentSpan.width();
                        if(curWidth <= maxWidth){
                            break;
                        }
                        size = size * 0.8;
                        $this.css('font-size', size);
                    }
                };

                // Call once to set.
                resizer();

                // Call on resize. Opera debounces their resize by default.
                $(window).on('resize.fittext', resizer);
                $scope.$on('fitdonut', resizer);
                $scope.$on('fitnumber', resizer);

                $scope.$on('$destroy', function () {
                    $(window).off('resize.fittext', resizer);
                });
            }
        };
    }
]);

indexApp.directive('dashboard', ['widgetUrl', '$location',
    function (widgetUrl, $location) {
        return {
            restrict: 'A',
            scope: {
                dashboard: '=',
                widgets: '=',
                widgetLayer: '='
            },
            templateUrl: 'public/src/include/dashboard_layout.html',
            link: function ($scope, $elem) {
                $scope.widgetUrl = widgetUrl;
            }
        };
    }
]);

indexApp.controller('DeleteWidgetCtrl', ['$scope', '$routeParams', '$q', 'Dashboard', 'Widget',
    function ($scope, $routeParams, $q, Dashboard, Widget) {
        $scope.deleteWidget = function (controller) {
            $scope.$emit('deleteWidget', controller);

            Widget.delete({
                dashboardid: parseInt($routeParams.id, 10),
                id: controller.id
            });
        };
    }
]);
