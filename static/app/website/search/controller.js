angular.module('bigcity.website.search', ['ui.router'])

    .config(['$stateProvider', function ($stateProvider) {
        'use strict';
        $stateProvider
            .state('search', {
                url: '/search',
                abstract: true,
                resolve: {
                    categories: function (NodesService) {
                        return NodesService.categories();
                    }
                },
                templateUrl: '/static/app/website/search/main.html',
                controller: ['$scope', 'categories', function ($scope, categories) {
                    $scope.categories = [];
                    $scope.adverts = [];
                    $scope.loading = false;
                    $scope.data = categories;
                    $scope.grouped = categories[2];
                }]
            })
            .state('search.all', {
                url: '/all',
                views: {
                    'category': {
                        templateUrl: '/static/app/website/search/all.html',
                        controller: ['$scope',
                            function ($scope) {
                                $scope.categories = $scope.data[0];
                            }]
                    }
                }
            })
            .state('search.category', {
                url: '/:categoryId',
                views: {
                    'category': {
                        templateUrl: '/static/app/website/search/category.html',
                        controller: ['$scope', '$stateParams',
                            function ($scope, $stateParams) {
                                var catDict = $scope.data[3],
                                    curCat = catDict[$stateParams.categoryId],
                                    childNodes = $scope.data[1],
                                    parentNodeId = curCat.parent || curCat.id;

                                $scope.categories = $scope.data[2];
                                $scope.current = curCat;
                                $scope.parent = catDict[parentNodeId];
                                $scope.children = angular.element.grep(childNodes, function (n) {
                                    return n.parent === parentNodeId;
                                });
                            }]
                    },
                    'search': {
                        controller: ['$scope', '$stateParams', 'NodesService',
                            function ($scope, $stateParams, NodesService) {
                                var catDict = $scope.data[3],
                                    curCat = catDict[$stateParams.categoryId],
                                    parentNodeId = curCat.parent || curCat.id;

                                $scope.current = curCat;
                                $scope.location = '';
                                $scope.text = '';
                                $scope.parent = catDict[parentNodeId];
                                $scope.search = function () {
                                    $scope.$parent.adverts = [];
                                    $scope.$parent.loading = true;
                                    NodesService.nearest({
                                        category: $scope.current,
                                        location: $scope.location,
                                        text: $scope.text
                                    }).then(function (data) {
                                        $scope.$parent.loading = false;
                                        $scope.$parent.adverts = data.results;
                                    });
                                };
                            }]
                    },
                    'adverts': {
                        controller: ['$scope', '$stateParams', 'NodesService',
                            function ($scope, $stateParams, NodesService) {
                                var catDict = $scope.data[3],
                                    curCat = catDict[$stateParams.categoryId];

                                $scope.$parent.loading = true;
                                $scope.$parent.adverts = [];
                                NodesService.nearest({
                                    category: curCat.id
                                }).then(function (data) {
                                    $scope.$parent.adverts = data.results;
                                }).finally(function () {
                                    $scope.$parent.loading = false;
                                });
                            }]
                    }
                }
            });
    }]);
