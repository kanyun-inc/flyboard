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
                template: 'Loading...',
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

indexApp.controller('UrlCtrl', ['$scope', '$location', '$q', 'Project', 'Dashboard',
    function ($scope, $location, $q, Project, Dashboard){
        $scope.dashboard = null;

        Project.query().$promise.then(function (projects) {
            if(!projects || !projects.length){
                return ;
            }

            Dashboard.query({
                project_id: projects[0].id
            }).$promise.then(function (dashboards) {
                if(!dashboards || !dashboards.length) {
                    return ;
                }

                var url = '/projects/' + projects[0].id + '/dashboards/' + dashboards[0].id;
                $location.path(url);
            });
        });

    }
]);

indexApp.controller('SlideCtrl', ['$scope', '$route', '$routeParams', '$window', '$q', '$location', '$interval', '$timeout', 'Dashboard', 'Project',
    function ($scope, $route, $routeParams, $window, $q, $location, $interval, $timeout, Dashboard, Project) {
        $scope.$on('$routeChangeSuccess', function () {
            var projectId = $routeParams.project_id;
            var dashboardId = $routeParams.id;

            if(!projectId || !dashboardId) {
                return ;
            }

            //if editLayoutCtrl, no slide
            if ($route.current.$$route && $route.current.$$route.controller === 'editLayoutCtrl') {
                $($window).off('mousemove', resetCheck);
                stopCheck();
            }

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
                    project_id: project.id
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
            var currentDashboardIdx = null;

            $scope.dashboards.some(function (dashboard, idx) {
                if (dashboard.id === $scope.dashboard.id) {
                    currentDashboardIdx = idx;
                    return true;
                }
            });

            currentDashboardIdx = (currentDashboardIdx + 1) % $scope.dashboards.length;

            var newUrl = '/projects/' + $scope.project.id + '/dashboards/' + $scope.dashboards[currentDashboardIdx].id;
            $location.path(newUrl);

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

        // check away from keyboard
        var checkTimer = null;

        function startCheck() {
            stopCheck();

            checkTimer = $timeout(startSlide, SLIDE_INTERVAL_TIME);
        }

        function stopCheck() {
            if (checkTimer) {
                $timeout.cancel(checkTimer);
                checkTimer = null;
            }
        }

        function resetCheck() {
            stopSlide();
            stopCheck();
            stopPhaseTimer();
            stopPhaseDelayTimer();

            startCheck();
        }

        startCheck();
        $($window).on('mousemove', resetCheck);

        $scope.$on('$destroy', function () {
            $($window).off('mousemove', resetCheck);

            stopSlide();
            stopCheck();
            stopPhaseTimer();
            stopPhaseDelayTimer();
        });
    }
]);

indexApp.controller('NavCtrl', ['$scope', '$route', '$routeParams', '$q', '$location', '$window', 'Dashboard', 'Project',
    function ($scope, $route, $routeParams, $q, $location, $window, Dashboard, Project) {
        $scope.unfold = false;
        $scope.editLayoutMode = false;
        var lastProjectId = null;

        function init(evt) {
            // ignore element resize event
            if (evt.target !== undefined) {
                return;
            }

            var projectId = $routeParams.project_id;
            var dashboardId = $routeParams.id;

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
                    project_id: project.id
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

        $scope.toggleEditLayoutMode = function () {
            if(!$scope.project || !$scope.dashboard){
                return ;
            }

            $scope.editLayoutMode = !$scope.editLayoutMode;

            var newUrl = '/projects/' + $scope.project.id + '/dashboards/' + $scope.dashboard.id + ($scope.editLayoutMode ? '/edit' : '');
            $location.path(newUrl);
        };

        $scope.setUnfold = function (value) {
            $scope.unfold = value;
        };

        $scope.selectProject = function (project) {
            $scope.project = project;

            Dashboard.query({
                project_id: project.id
            }).$promise.then(function (dashboards) {
                $scope.dashboard = dashboards && dashboards.length ? dashboards[0] : null;

                var newUrl = '/projects/' + $scope.project.id + '/dashboards/' + ( $scope.dashboard ? $scope.dashboard.id : '' );
                $location.path(newUrl);
            });
        };
    }
]);

indexApp.controller('IndexCtrl', ['$scope', '$q', '$window', '$routeParams', '$location', '$interval', 'Dashboard', 'Project', 'Widget', 'widgetUrl',
    function ($scope, $q, $window, $routeParams, $location, $interval, Dashboard, Project, Widget, widgetUrl) {
        var projectId = $routeParams.project_id || null;
        var dashboardId = $routeParams.id || null;

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
                project_id: project.id
            }).$promise;
        });

        $scope.dashboard = $scope.dashboards.then(function (dashboards) {
            $scope.dashboards = dashboards;

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
        $scope.dashboards = Dashboard.query();
        $scope.addedControllers = [];
        $scope.gridLayerStatus = [];

        var projectId = $routeParams.project_id;
        var dashboardId = $routeParams.id;

        $scope.projects = Project.query();

        $scope.project = Project.get({
           id: projectId
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

            //delete widget info in dashboard
            $scope.dashboard.config.layout.some(function (widgetLayout, idx) {
                if (widgetLayout.id === widgetId) {
                    $scope.dashboard.config.layout.splice(idx, 1);
                    return true;
                }
            });

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
                    var i;
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

indexApp.controller('EditProjectModalCtrl', ['$scope', '$modal',
    function ($scope, $modal) {
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
                            Project.get(id).$promise.then(function (project) {
                                projects.push(project);
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
                    var newX = Math.round($(this).offset().top / $(this).parents('.layer').height() * gridLayerConfig.number);
                    var newY = Math.round($(this).offset().left / $(this).parents('.layer').width() * gridLayerConfig.number);

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

indexApp.directive('widgetSpline', [
    '$q',
    'DataSource',
    'Record',
    '$timeout',
    'widgetUrl',
    'Message',
    function ($q, DataSource, Record, $timeout, widgetUrl, Message) {
        return {
            restirct: 'A',
            scope: {
                widget: '=widget',
                dashboard: '=ds'
            },
            templateUrl: 'public/src/include/widgets/spline.html',
            replace: true,
            link: function ($scope, $elem) {

                $scope.widgetUrl = widgetUrl;
                $scope.updatedTime = null;

                var config = $scope.widget.config;
                var $container = $($elem).find('.content');
                config.dataInfos = config.dataInfos || [];

                //request data
                function requestData() {
                    if (config.dataInfos.length === 1) {
                        return DataSource.get({
                            id: config.dataInfos[0].id
                        }).$promise.then(function (dataSource) {
                                return Record.query({
                                    id: dataSource.id,
                                    limit: config.limit || 0
                                }).$promise.then(function (resp) {
                                    //filter
                                    var formatedRespList = aggregationAndFilter(resp, config.dataInfos[0], 'filter');

                                    return formatedRespList.map(function (formatedResp, index) {
                                        var lineOpt = {};
                                        lineOpt.name = dataSource.name + additionalLabel(config.dataInfos[0], formatedResp);
                                        index = index >= defaultColors.length ? (index % defaultColors.length) : index;
                                        lineOpt.color = defaultColors[index];
                                        lineOpt.data = [];
                                        formatedRespList = formatedRespList || [];

                                        formatedResp.reverse().forEach(function (record) {
                                            lineOpt.data.push({
                                                x: getTimeFromRecord(record),
                                                y: record.value
                                            });
                                        });

                                        return lineOpt;
                                    });
                                });
                            });
                    }
                    else {
                        return config.dataInfos.map(function (dataInfo, index) {
                            return DataSource.get({
                                id: dataInfo.id
                            }).$promise.then(function (dataSource) {
                                    return Record.query({
                                        id: dataInfo.id,
                                        limit: config.limit || 0
                                    }).$promise.then(function (resp) {

                                        //aggregation
                                        var formatedResp = aggregationAndFilter(resp, dataInfo, 'aggregation');

                                        var lineOpt = {};
                                        lineOpt.name = dataSource.name + additionalLabel(dataInfo, formatedResp);
                                        index = index >= defaultColors.length ? (index % defaultColors.length) : index;
                                        lineOpt.color = defaultColors[index];
                                        lineOpt.data = [];
                                        formatedResp = formatedResp || [];

                                        formatedResp.reverse().forEach(function (record) {
                                            lineOpt.data.push({
                                                x: getTimeFromRecord(record),
                                                y: record.value
                                            });
                                        });

                                        return lineOpt;
                                    });
                                });
                        });
                    }
                }

                //draw chart

                var promises = requestData();

                $q.all(promises).then(function (dataSeries) {
                    if (isScopeDestroyed($scope)) {
                        return;
                    }

                    //timestamp
                    if(dataSeries && dataSeries.length){
                        var timeStamp = new Date(dataSeries[0].data[dataSeries[0].data.length - 1].x);
                        $scope.updatedTime = formatDate(timeStamp);
                    }

                    //redraw the chart
                    function redraw() {
                        var chart = this;

                        var promises = requestData();

                        $q.all(promises).then(function (dataSeries) {
                            //timestamp
                            if(dataSeries && dataSeries.length){
                                var timeStamp = new Date(dataSeries[0].data[dataSeries[0].data.length - 1].x);
                                $scope.updatedTime = formatDate(timeStamp);
                            }

                            for (var idx = chart.series.length - 1; idx >= 0; idx--) {
                                chart.series[idx].remove(true);
                            }

                            dataSeries.forEach(function (seriesObj) {
                                chart.addSeries(seriesObj);
                            });

                            chart.redraw();
                        }).catch(function (errorType) {

                        });
                    }

                    var chart = new Highcharts.Chart({
                        chart: {
                            renderTo: $container.get(0),
                            backgroundColor: '#3b3b3b',
                            type: 'spline',
                            animation: Highcharts.svg, // don't animate in old IE
                            marginRight: 15,
                            marginTop: 10,
                            events: {}
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            type: 'datetime',
                            tickPixelInterval: 150,
                            lineColor: 'rgb(169, 169, 169)'
                        },
                        yAxis: {
                            title: null,
                            gridLineColor: null,
                            plotLines: null,
                            min: ( config.minThreshold !== undefined && config.minThreshold >= 0 ) ? config.minThreshold : null,
                            max: ( config.maxThreshold !== undefined && config.maxThreshold >= 0 ) ? config.maxThreshold : null,
                            startOnTick: false,
                            endOnTick: false
                        },
                        tooltip: {
                            crosshairs: true,
                            shared: true
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'left',
                            verticalAlign: 'top',
                            y: 0,
                            floating: true,
                            borderWidth: 0,
                            itemStyle: {
                                color: 'lightgray'
                            }
                        },
                        exporting: {
                            enabled: false
                        },
                        series: dataSeries,
                        plotOptions: {
                            spline: {
                                colors: defaultColors,
                                dataLabels: {
                                    enabled: true,
                                    color: 'lightgray',
                                    formatter: function () {
                                        if (this.point.x === this.series.data[this.series.data.length - 1].x) {
                                            return this.y;
                                        } else {
                                            return null;
                                        }
                                    }
                                }
                            }
                        }
                    });

                    function resizeWidget(evt, data) {
                        if (data && data.id === $scope.widget.id) {
                            chart.reflow();
                        }
                    }

                    function updateWidget(evt, data) {
                        if (data && data.id === $scope.widget.id) {
                            redraw.apply(chart);
                        }
                    }

                    var cleanUpFuncs = [];
                    cleanUpFuncs.push($scope.$on('widgetlayoutchange', resizeWidget));
                    cleanUpFuncs.push($scope.$on('widgetupdate', updateWidget));

                    $scope.$on('$destroy', function () {
                        $timeout(function () {
                            if (chart) {
                                chart.destroy();
                            }
                        }, 5000);

                        cleanUpFuncs.forEach(function (cleanUpFunc) {
                            cleanUpFunc();
                        });
                    });
                }).catch(function (errorType) {
                    if (errorType.status === 404) {
                        Message.alert('Widget' + ' “' + $scope.widget.config.name + '” ' + '中包含不存在的数据源！');
                    }
                });
            }
        };
    }
]);

indexApp.directive('widgetPie', [
    'widgetUrl',
    '$q',
    'DataSource',
    'Record',
    '$timeout',
    'Message',
    function (widgetUrl, $q, DataSource, Record, $timeout, Message) {
        return {
            restrict: 'A',
            scope: {
                widget: '=widget',
                widgets: '=',
                dashboard: '=ds'
            },
            templateUrl: 'public/src/include/widgets/pie.html',
            replace: true,
            link: function ($scope, $elem) {
                $scope.widgetUrl = widgetUrl;
                $scope.updatedTime = null;

                var $container = $($elem).find('.cf-pie');
                var pId = $container.prop('id');
                var config = $scope.widget.config;
                config.dataInfos = config.dataInfos || [];

                // Store chart information
                cf_rPs[pId] = {};

                function requestData() {
                    if (config.dataInfos.length === 1) {
                        return DataSource.get({
                            id: config.dataInfos[0].id
                        }).$promise.then(function (dataSource) {
                            return Record.query({
                                id: dataSource.id,
                                limit: 1
                            }).$promise.then(function (response) {
                                var respList = aggregationAndFilter(response, config.dataInfos[0], 'filter');

                                return respList.map(function (resp) {
                                    if ((resp ? resp.length : 0) === 0) {
                                        return [dataSource.name, 0, null];
                                    }
                                    return [dataSource.name + additionalLabel(config.dataInfos[0], resp), resp[0].value, resp[0].date_time];
                                });
                            });
                        });
                    }
                    else {
                        return config.dataInfos.map(function (dataInfo) {
                            return DataSource.get({
                                id: dataInfo.id
                            }).$promise.then(function (dataSource) {
                                return Record.query({
                                    id: dataSource.id,
                                    limit: 1
                                }).$promise.then(function (response) {
                                    var resp = aggregationAndFilter(response, dataInfo, 'aggregation');

                                    if ((resp ? resp.length : 0) === 0) {
                                        return [dataSource.name, 0, null];
                                    }
                                    return [dataSource.name + additionalLabel(dataInfo, resp), resp[0].value, resp[0].date_time];
                                });
                            });
                        });
                    }
                }

                //request data
                var promises = requestData();

                //draw chart
                $q.all(promises).then(function (data) {
                    if (isScopeDestroyed($scope)) {
                        return;
                    }

                    //timestamp
                    if(data && data.length && data[0][2]){
                        $scope.updatedTime = formatDate(new Date(data[0][2]));
                    }

                    function reload() {
                        var promises = requestData();

                        $q.all(promises).then(function (data) {
                            //timestamp
                            if(data && data.length && data[0][2]){
                                $scope.updatedTime = formatDate(new Date(data[0][2]));
                            }

                            chart.series[0].setData(data);
                        }).catch(function (errorType) {
                            if (errorType.status === 404) {
                                Message.alert('Widget' + ' “' + $scope.widget.config.name + '” ' + '中包含不存在的数据源！');
                            }
                        });
                    }

                    var chart = new Highcharts.Chart({
                        chart: {
                            renderTo: $container.get(0),
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            backgroundColor: 'rgba(0,0,0,0)',
                            events: {}
                        },
                        title: {
                            text: ''
                        },
                        tooptip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                size: null,
                                center: [null, null],
                                allowPointSelect: true,
                                cursor: 'pointer',
                                colors: defaultColors,
                                dataLabels: {
                                    enabled: true,
                                    formatter: function () {
                                        var lineWidth = Math.round($container.width() / 3);
                                        var string = [].slice.call(this.point.name);
                                        var numberPerLine = Math.round(lineWidth / 14);
                                        var count = 0;

                                        for (var i = 1; i < string.length; i++) {
                                            if ((i - count) % numberPerLine === 0) {
                                                string.splice(i, 0, '<br>');
                                                count += 1;
                                                i += 1;
                                            }
                                        }

                                        return '<b>' + string.join('') + '</b>:' + this.point.percentage.toFixed(1) + '%';
                                    },
                                    color: 'lightgray',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                                        fontSize: '14px',
                                        width: Math.round($container.width() / 5) + 'px'
                                    }
                                }
                            }
                        },
                        series: [
                            {
                                type: 'pie',
                                name: config.name,
                                data: data
                            }
                        ]
                    });

                    function resizeWidget(evt, data) {
                        if (data && data.id === $scope.widget.id) {
                            chart.reflow();
                        }
                    }

                    function updateWidget(evt, data) {
                        if (data && data.id === $scope.widget.id) {
                            //reload
                            reload.apply(chart);
                            chart.redraw();
                        }
                    }

                    var cleanUpFuncs = [];
                    cleanUpFuncs.push($scope.$on('widgetlayoutchange', resizeWidget));
                    cleanUpFuncs.push($scope.$on('widgetupdate', updateWidget));

                    $scope.$on('$destroy', function () {
                        $timeout(function () {
                            if (chart) {
                                chart.destroy();
                            }
                        }, 5000);

                        cleanUpFuncs.forEach(function (cleanUpFunc) {
                            cleanUpFunc();
                        });
                    });
                }).catch(function (errorType) {
                    if (errorType.status === 404) {
                        Message.alert('Widget' + ' “' + $scope.widget.config.name + '” ' + '中包含不存在的数据源！');
                    }
                });
            }
        };
    }
]);

indexApp.directive('widgetDonut', [
    'widgetUrl',
    'Record',
    '$timeout',
    'Message',
    function (widgetUrl, Record, $timeout, Message) {
        return {
            restrict: 'A',
            scope: {
                widget: '=widget',
                dashboard: '=ds'
            },
            templateUrl: 'public/src/include/widgets/donut.html',
            replace: true,
            link: function ($scope, $elem) {
                $scope.widgetUrl = widgetUrl;
                $scope.updatedTime = null;

                var $this = this;
                var $container = $elem.find('.cf-svp');
                var $metrics = $container.find('.metrics');
                var $arrow = $elem.find('.change .arrow');
                var $changeMetric = $elem.find('div.change');
                var $changeMetricContent = $changeMetric.find('.change-content');
                var $large = $changeMetric.find('.large');
                var $small = $changeMetric.find('.small');
                var config = $scope.widget.config;
                $container.data('id', 'widget-' + $scope.widget.id);

                var chartWrapper = rSVP($container);
                //broadcast to call fitText once
                $scope.$broadcast('fitdonut');

                function reload() {
                    var $container = $(this).find('.cf-svp');

                    Record.query({
                        id: config.dataInfos[0].id,
                        limit: 2,
                        dimensions: JSON.stringify(config.dataInfos[0].dimensions)
                    }).$promise.then(function (response) {

                        //aggregation
                        var resp = aggregationAndFilter(response, config.dataInfos[0], 'aggregation');

                        //update change percentage
                        resp = (!resp || resp.length === 0) ? [
                            {value: null}
                        ] : resp;

                        var det;
                        if (!resp || resp.length !== 2 || ( resp.length === 2 && resp[1].value === 0 )) {
                            det = 0;
                        }
                        else {
                            det = ((resp[0].value - resp[1].value) / Math.abs(resp[1].value)) * 100;
                        }

                        if (det > 0) {
                            $arrow.removeClass('glyphicon-arrow-down');
                            $arrow.addClass('glyphicon-arrow-up');
                            $changeMetric.removeClass('m-green');
                            $changeMetric.addClass('m-red');
                        }
                        else {
                            $arrow.removeClass('glyphicon-arrow-up');
                            $arrow.addClass('glyphicon-arrow-down');
                            $changeMetric.removeClass('m-red');
                            $changeMetric.addClass('m-green');
                        }

                        //update change metric value
                        det = Math.abs(det).toFixed(2).toString().split('.');
                        $large.text(det[0]);
                        $small.text('.' + det[1] + '%');
                        $changeMetricContent.css('margin-left', ($changeMetric.width() - $changeMetricContent.width()) / 2);

                        //update current value
                        var chart = chartWrapper.chart;
                        if (resp[0].value === null) {
                            $metrics.css('display', 'none');
                        }
                        else {
                            config.value = resp[0].value + '';
                            $metrics.css('display', '');
                        }

                        // Call EasyPieChart update function
                        chart.update(config.value);
                        // Update the data-percent so it redraws on resize properly
                        $container.find('.chart').data('percent', config.value);
                        // Update the UI metric
                        $elem.find('.metric').html(numeral(config.value).format('0,0.[00]'));

                        //timestamp
                        if(resp && resp.length){
                            $scope.updatedTime = formatDate(new Date(resp[0].date_time));
                        }
                    }).catch(function (errorType) {
                        if (errorType.status === 404) {
                            Message.alert('Widget' + ' “' + $scope.widget.config.name + '” ' + '中包含不存在的数据源！');
                        }
                    });
                }

                reload.apply($this);

                function resizeWidget(evt, data) {
                    if (data && data.id === $scope.widget.id) {
                        chartWrapper.generateChart();
                    }
                }

                function updateWidget(evt, data) {
                    if (data && data.id === $scope.widget.id) {
                        reload.apply($this);
                        chartWrapper.generateChart();
                    }
                }

                var cleanUpFuncs = [];
                cleanUpFuncs.push($scope.$on('widgetlayoutchange', resizeWidget));
                cleanUpFuncs.push($scope.$on('widgetupdate', updateWidget));

                $scope.$on('$destroy', function () {
                    $timeout(function () {
                        if (chartWrapper) {
                            chartWrapper.destroy();
                        }
                    }, 5000);

                    cleanUpFuncs.forEach(function (cleanUpFunc) {
                        cleanUpFunc();
                    });
                });
            }
        };
    }
]);

indexApp.directive('widgetNumber', [
    'widgetUrl',
    '$q',
    'Record',
    'Message',
    function (widgetUrl, $q, Record, Message) {
        return {
            restrict: 'A',
            scope: {
                widget: '=widget',
                dashboard: '=ds'
            },
            templateUrl: 'public/src/include/widgets/number.html',
            replace: true,
            link: function ($scope, $elem) {
                $scope.widgetUrl = widgetUrl;
                $scope.updatedTime = null;

                var $widget = $($elem);
                var $metric = $widget.find('.metric');
                var $metricSmall = $widget.find('.metric-small');
                var $change = $widget.find('.change');
                var $arrow = $widget.find('.arrow');
                var $large = $widget.find('.large');
                var $small = $widget.find('.small');
                var config = $scope.widget.config;

                // No custom options

                function reload() {
                    Record.query({
                        id: config.dataInfos[0].id,
                        limit: 2,
                        dimensions: JSON.stringify(config.dataInfos[0].dimensions)
                    }).$promise.then(function (response) {
                            //aggregation
                            var resp = aggregationAndFilter(response, config.dataInfos[0], 'aggregation');

                            resp = (!resp || resp.length === 0) ? [
                                {value: null}
                            ] : resp;
                            var det;

                            if (!resp || resp.length !== 2 || ( resp.length === 2 && resp[1].value === 0 )) {
                                det = 0;
                            }
                            else {
                                det = ((resp[0].value - resp[1].value) / Math.abs(resp[1].value)) * 100;
                            }

                            if (det > 0) {
                                $arrow.removeClass('glyphicon-arrow-down');
                                $arrow.addClass('glyphicon-arrow-up');
                                $metricSmall.removeClass('m-green');
                                $metricSmall.addClass('m-red');
                            }
                            else {
                                $arrow.removeClass('glyphicon-arrow-up');
                                $arrow.addClass('glyphicon-arrow-down');
                                $metricSmall.removeClass('m-red');
                                $metricSmall.addClass('m-green');
                            }

                            $metric.html(numeral(resp[0].value).format('0,0.[00]'));
                            if (resp[0].value === null) {
                                $change.css('display', 'none');
                            } else {
                                $change.css('display', '');
                            }

                            det = Math.abs(det).toFixed(2).toString().split('.');
                            $large.text(det[0]);
                            $small.text('.' + det[1] + '%');

                            //timestamp
                            if(resp && resp.length){
                                $scope.updatedTime = formatDate(new Date(resp[0].date_time));
                            }
                        }, 'json').catch(function (errorType) {
                            if (errorType.status === 404) {
                                Message.alert('Widget' + ' “' + $scope.widget.config.name + '” ' + '中包含不存在的数据源！');
                            }
                        });
                }

                reload.apply(this);

                function updateWidget() {
                    reload.apply(this);
                }

                var cleanUpFuncs = [];

                cleanUpFuncs.push($scope.$on('widgetupdate', updateWidget));

                $scope.$on('$destroy', function () {
                    cleanUpFuncs.forEach(function (cleanUpFunc) {
                        cleanUpFunc();
                    });
                });
            }
        };
    }
]);

indexApp.directive('widgetColumn', [
    'widgetUrl',
    '$q',
    'DataSource',
    'Record',
    '$timeout',
    'Message',
    function (widgetUrl, $q, DataSource, Record, $timeout, Message) {
        return {
            restrict: 'A',
            scope: {
                widget: '=widget',
                widgets: '=',
                dashboard: '=ds'
            },
            templateUrl: 'public/src/include/widgets/column.html',
            replace: true,
            link: function ($scope, $elem) {
                $scope.widgetUrl = widgetUrl;
                $scope.updatedTime = null;

                var config = $scope.widget.config;
                var $container = $($elem).find('.content');
                var timeLine = [];
                config.dataInfos = config.dataInfos || [];

                function reload() {
                    var promises = null;

                    if (config.dataInfos.length === 1) {
                        promises = DataSource.get({
                            id: config.dataInfos[0].id
                        }).$promise.then(function (dataSource) {
                                return Record.query({
                                    id: dataSource.id,
                                    limit: config.limit
                                }).$promise.then(function (resp) {
                                        //filter
                                        var recordsList = aggregationAndFilter(resp, config.dataInfos[0], 'filter');

                                        return recordsList.map(function (records) {
                                            return {
                                                name: dataSource.name + additionalLabel(config.dataInfos[0], records),
                                                records: (function () {
                                                    return records.map(function (record) {
                                                        return record;
                                                    });
                                                })()
                                            };
                                        });
                                    });
                            });
                    }
                    else {
                        promises = config.dataInfos.map(function (dataInfo) {
                            return DataSource.get({
                                id: dataInfo.id
                            }).$promise.then(function (dataSource) {
                                    return Record.query({
                                        id: dataSource.id,
                                        limit: config.limit
                                    }).$promise.then(function (resp) {
                                            //aggregation
                                            var records = aggregationAndFilter(resp, dataInfo, 'aggregation');

                                            return {
                                                name: dataSource.name + additionalLabel(dataInfo, records),
                                                records: (function () {
                                                    return records.map(function (record) {
                                                        return record;
                                                    });
                                                })()
                                            };
                                        });
                                });
                        });
                    }

                    $q.all(promises).then(function (results) {
                        var sortedMultiRecords = sortMultiRecords(
                            (function () {
                                return results.map(function (result) {
                                    return result.records;
                                });
                            })(),
                            {
                                formatDate: formatDate
                            }
                        );

                        var dataSeries = results.map(function (result, idx) {
                            return {
                                name: result.name,
                                color: defaultColors[(idx >= defaultColors.length ? (idx % defaultColors.length) : idx)],
                                data: sortedMultiRecords[idx].map(
                                    function (record) {
                                        return record.value;
                                    })
                            };
                        });

                        timeLine = (sortedMultiRecords && sortedMultiRecords.length > 0) ? (function () {
                            return sortedMultiRecords[0].map(function (record) {
                                return record.time;
                            });
                        })() : [];

                        dataSeries.forEach(function (seriesObj) {
                            seriesObj.data.reverse();
                        });
                        timeLine.reverse();

                        //update data
                        chart.xAxis[0].setCategories(timeLine);

                        if (!chart.series || chart.series.length === 0) {
                            chart.series = [];
                            dataSeries.forEach(function (seriesObj) {
                                chart.addSeries(seriesObj);
                            });
                            chart.yAxis[0].update({
                                gridLineWidth: 1
                            });

                            chart.redraw();
                        } else {
                            chart.series.forEach(function (seriesObj, idx) {
                                seriesObj.setData(dataSeries[idx].data);
                            });
                        }

                        //timestamp
                        if(timeLine && timeLine.length){
                            $scope.updatedTime = formatDate(new Date(timeLine[timeLine.length - 1]));
                        }
                    }).catch(function (errorType) {
                        if (errorType.status === 404) {
                            Message.alert('Widget' + ' “' + $scope.widget.config.name + '” ' + '中包含不存在的数据源！');
                        }
                    });
                }

                //redraw the chart
                function redraw() {
                    var chart = this;

                    for (var idx = chart.series.length - 1; idx >= 0; idx--) {
                        chart.series[idx].remove(true);
                    }

                    reload.apply(chart);
                }

                //draw chart
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: $container.get(0),
                        type: 'column',
                        backgroundColor: '#3b3b3b',
                        marginRight: 20,
                        marginTop: 30,
                        events: {
                            load: function () {
                                reload.apply(this);
                            }
                        }
                    },
                    title: {
                        text: null
                    },
                    legend: {
                        itemStyle: {
                            color: 'lightgrey'
                        }
                    },
                    xAxis: {
                        categories: [],
                        lineColor: 'rgb(169,169,169)'
                    },
                    yAxis: {
                        title: {
                            text: null
                        },
                        gridLineColor: 'rgb(169, 169, 169)',
                        gridLineWidth: 0
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:12px">{point.key}</span><table>',
                        pointFormat: '<tr style="font-size: 10px"><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding: 0; color: #000000"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: []
                });

                function resizeWidget(evt, data) {
                    if (data && data.id === $scope.widget.id) {
                        chart.reflow();
                    }
                }

                function updateWidget(evt, data) {
                    if (data && data.id === $scope.widget.id) {
                        redraw.apply(chart);
                    }
                }

                var cleanUpFuncs = [];
                cleanUpFuncs.push($scope.$on('widgetlayoutchange', resizeWidget));
                cleanUpFuncs.push($scope.$on('widgetupdate', updateWidget));

                $scope.$on('$destroy', function () {
                    $timeout(function () {
                        if (chart) {
                            chart.destroy();
                        }
                    }, 5000);

                    cleanUpFuncs.forEach(function (cleanUpFunc) {
                        cleanUpFunc();
                    });
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

                var resizer = function () {
                    $this.css('font-size', compressor * Math.sqrt($this.width()));
                    $this.css('line-height', $this.css('font-size'));
                };

                // Call once to set.
                resizer();

                // Call on resize. Opera debounces their resize by default.
                $(window).on('resize.fittext', resizer);
                $scope.$on('fitdonut', resizer);

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
                dashboardid: $routeParams.id,
                id: controller.id
            });
        };
    }
]);
