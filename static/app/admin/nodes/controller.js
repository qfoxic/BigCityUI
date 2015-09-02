angular.module('bigcity.nodes', ['ui.router'])

    .config(['$stateProvider', function ($stateProvider) {
        'use strict';
        $stateProvider
            .state('nodes', {
                abstract: true,
                url: '/nodes',
                templateUrl: '/static/app/admin/nodes/main.html',
                controller: ['$scope', '$state', 'messages', 'NodesService',
                    function ($scope, $state, messages, NodesService) {
                        $scope.update = function (user, form) {
                        };
                        $scope.create = function (node, nodeType) {
                            messages.info('Creating ' + nodeType + '. Please wait...');
                            NodesService.create(node, nodeType).then(
                                function () {
                                    messages.success(nodeType + 'was saved.');
                                },
                                function () {
                                    messages.error('Could not create ' + nodeType + '. Please try again.');
                                }
                            );
                        };
                        $scope.delete = function (category) {
                            messages.info('Removing a category. Please wait ...');
                            NodesService.delete({nid: category.id}, 'category').then(
                                function () {
                                    var index = $scope.nodes.results.indexOf(category);
                                    $scope.nodes.results.splice(index, 1);
                                    messages.success('Node was removed.');
                                },
                                function () {
                                    messages.error('Could not remove node. Please try again.');
                                }
                            );
                        };
                        $scope.list = function (page, kind, expr) {
                            if (page < 1 || page > $scope.pages) {
                                return;
                            }
                            $scope.page = page;
                            $scope.nodes = {};
                            $scope.pages = 0;
                            $scope.loading = true;
                            NodesService.list({page: page, kind: kind, where: expr}).then(
                                function (data) {
                                    $scope.nodes = data;
                                    $scope.pages = Math.ceil(data.count / 50);
                                    $scope.loading = false;
                                },
                                function (error) {
                                    $scope.loading = false;
                                }
                            );
                        };
                    }]
            })
            .state('nodes.list', {
                url: '/list',
                templateUrl: '/static/app/admin/nodes/list.html',
                controller: ['$scope', 'NODE_TYPES', function ($scope, NODE_TYPES) {
                    $scope.nodeTypes = [NODE_TYPES.CATEGORY, NODE_TYPES.ADVERT];
                    $scope.createNodeTypes = [NODE_TYPES.CATEGORY];
                    $scope.curType = $scope.nodeTypes[0];
                    $scope.curTypeCreate = $scope.nodeTypes[0];
                    $scope.expr = null;
                    $scope.selectType = function (ntype) {
                        $scope.curType = ntype;
                        $scope.list(1, $scope.curType, $scope.expr);
                    };
                    $scope.selectTypeCreate = function (ntype) {
                        $scope.curTypeCreate = ntype;
                    };
                    $scope.list(1, $scope.curType, $scope.expr);
                }]
            })
            .state('nodes.create', {
                url: '/create?nodeType',
                resolve: {
                    categories: function (NodesService) {
                        return NodesService.categories();
                    }
                },
                views: {
                    '': {
                        templateUrl: '/static/app/admin/nodes/create.html',
                        controller: ['$scope', '$stateParams', 'NodesService', 'messages', 'NODE_MODELS', 'categories',
                            function ($scope, $stateParams, NodesService, messages, NODE_MODELS, categories) {
                                var ntype = $stateParams.nodeType,
                                    noCategory = {id: null, title: 'No Category'};
                                $scope.grouped = categories ? categories[2] : [];
                                $scope.grouped.splice(0, 0, noCategory);
                                $scope.node = NODE_MODELS[ntype];
                            }]
                    }
                }
            })
            .state('nodes.detail', {
                url: '/detail/:nid',
                views: {
                    '': {
                        templateUrl: '/static/app/admin/nodes/data.html',
                        controller: ['$scope', '$stateParams', 'NodesService', 'messages',
                            function ($scope, $stateParams, NodesService, messages) {
                                $scope.node = {};
                                NodesService.get($stateParams.nid).then(
                                    function (data) {
                                        $scope.node = data.result;
                                    },
                                    function (err) {
                                        messages.error(err.data.error);
                                    }
                                );
                            }]
                    }
                }
            });
    }]);
