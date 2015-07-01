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
                        $scope.searchParams = {
                            categoryId: null,
                            location: null,
                            text: null,
                            priceFrom: null,
                            priceTo: null,
                            order: '',
                            page: 1
                        };
                        $scope.search = function (params) {
                            $scope.adverts = [];
                            $scope.loading = true;
                            NodesService.nearest({
                                category: params.categoryId,
                                priceTo: params.priceTo,
                                priceFrom: params.priceFrom,
                                text: params.text,
                                location: params.location,
                                page: params.page,
                                order: params.order
                            }).then(function (data) {
                                $scope.loading = false;
                                $scope.adverts = data.results;
                            });
                        };
                        $scope.next = function () {
                            if ($scope.adverts) {
                                $scope.searchParams.page += 1;
                                $scope.search($scope.searchParams);
                            }
                        };
                        $scope.prev = function () {
                            if ($scope.searchParams.page > 1) {
                                $scope.searchParams.page -= 1;
                                $scope.search($scope.searchParams);
                            }
                        };
                    }]
            })
            .state('search.all', {
                url: '/all',
                views: {
                    'aside': {
                        templateUrl: '/static/app/website/search/aside.html',
                        controller: ['$scope',
                            function ($scope) {
                                var childNodes = $scope.data[0];

                                $scope.current = null;
                                $scope.searchParams = $scope.$parent.searchParams;
                                $scope.children = angular.element.grep(childNodes, function (n) {
                                    return n.parent === null;
                                });
                            }]
                    },
                    'search': {
                        templateUrl: '/static/app/website/search/search.html',
                        controller: ['$scope',
                            function ($scope) {
                                $scope.current = null;
                                $scope.searchParams = $scope.$parent.searchParams;
                            }]
                    }
                }
            })
            .state('search.category', {
                url: '/:categoryId',
                views: {
                    'aside': {
                        templateUrl: '/static/app/website/search/aside.html',
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
                                $scope.searchParams = $scope.$parent.searchParams;
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
                                $scope.parent = catDict[parentNodeId];
                                $scope.searchParams = $scope.$parent.searchParams;
                            }]
                    },
                    'adverts': {
                        controller: ['$scope', '$stateParams',
                            function ($scope, $stateParams) {
                                var catDict = $scope.data[3],
                                    curCat = catDict[$stateParams.categoryId];

                                $scope.$parent.searchParams.categoryId = curCat.id;
                                $scope.search({categoryId: curCat.id});
                            }]
                    }
                }
            });
    }]);
