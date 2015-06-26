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
                controller: ['$scope', 'categories', 'NodesService',
                    function ($scope, categories, NodesService) {
                        $scope.categories = [];
                        $scope.adverts = [];
                        $scope.loading = false;
                        $scope.data = categories;
                        $scope.grouped = categories[2];
                        $scope.search = function (params) {
                            $scope.adverts = [];
                            $scope.loading = true;
                            NodesService.nearest({
                                category: params.categoryId,
                                priceTo: params.priceTo,
                                priceFrom: params.priceFrom,
                                text: params.text,
                                location: params.location
                            }).then(function (data) {
                                $scope.loading = false;
                                $scope.adverts = data.results;
                            });
                        };
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
                    'aside': {
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
                                $scope.priceTo = null;
                                $scope.priceFrom = null;
                                $scope.children = angular.element.grep(childNodes, function (n) {
                                    return n.parent === parentNodeId;
                                });
                            }]
                    },
                    'search': {
                        templateUrl: '/static/app/website/search/search.html',
                        controller: ['$scope', '$stateParams',
                            function ($scope, $stateParams) {
                                var catDict = $scope.data[3],
                                    curCat = catDict[$stateParams.categoryId],
                                    parentNodeId = curCat.parent || curCat.id;

                                $scope.current = curCat;
                                $scope.selectedCat = curCat.id;
                                $scope.location = '';
                                $scope.text = '';
                                $scope.parent = catDict[parentNodeId];
                            }]
                    },
                    'adverts': {
                        controller: ['$scope', '$stateParams', 'NodesService',
                            function ($scope, $stateParams, NodesService) {
                                var catDict = $scope.data[3],
                                    curCat = catDict[$stateParams.categoryId];

                                $scope.$parent.loading = true;
                                $scope.$parent.adverts = [];
                                //TODO. Put to parent controller.
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
