angular.module('bigcity.website.advert', [
    'ui.router'
])
    .config(['$stateProvider', function ($stateProvider) {
    'use strict';
    $stateProvider
        .state('advert', {
            url: '/advert',
            abstract: true
        })
        .state('advert.create', {
            url: '/create',
            resolve: {
                categories: function (NodesService) {
                    return NodesService.categories();
                }
            },
            views: {
                'preview': {
                    templateUrl: '/static/app/website/advert/create.html',
                    controller: ['$scope', 'categories', 'NodesService',
                        function ($scope, categories, NodesService) {
                            $scope.grouped = categories ? categories[2] : [];
                            $scope.advert = {
                                parent: null,
                                title: null,
                                price: null,
                                text: null,
                                location: null,
                                // TODO REmove hardcoded items.
                                square_gen: 70,
                                room_height: 2,
                                floor: 2,
                                square_live: 100,
                                floors: 12,
                                rooms: 12,
                                wall_type: 0,
                                build_type: 0
                            };
                            $scope.uploader = null;
                            $scope.create = function (advert) {
                                NodesService.create(advert, 'advert').then(
                                    function(data) {
                                        $scope.uploader = NodesService.uploader(data.result);
                                    },
                                    function(error) {

                                    });
                            };
                        }]
                },
                'aside': {
                    templateUrl: '/static/app/website/advert/create.aside.html'
                }
            }
        })
        .state('advert.edit', {
            url: '/:advertId/edit',
            resolve: {
                categories: function (NodesService) {
                    return NodesService.categories();
                },
                advert: function ($stateParams, NodesService) {
                    return NodesService.get($stateParams.advertId, 'advert');
                },
                images: function($stateParams, NodesService) {
                    return NodesService.images({nid: $stateParams.advertId});
                }
            },
            views: {
                'preview': {
                    templateUrl: '/static/app/website/advert/edit.html',
                    controller: ['$scope', 'categories', 'advert', 'images', 'NodesService',
                        function ($scope, categories, advert, images, NodesService) {
                            $scope.grouped = categories ? categories[2] : [];
                            $scope.advert = {
                                title: advert.result.title,
                                price: advert.result.price,
                                text: advert.result.text,
                                location: advert.result.street + advert.result.city,
                                square_gen: advert.result.square_gen,
                                room_height: advert.result.room_height,
                                floor: advert.result.floor,
                                square_live: advert.result.square_live,
                                floors: advert.result.floors,
                                rooms: advert.result.rooms,
                                wall_type: advert.result.wall_type,
                                build_type: advert.result.build_type
                            };
                            $scope.uploader = NodesService.uploader(advert.result);
                            $scope.save = function (advert) {
                                NodesService.update(advert, 'advert').then(
                                    function(data) {
                                    },
                                    function(error) {
                                    });
                            };
                        }]
                },
                'aside': {
                    templateUrl: '/static/app/website/advert/create.aside.html'
                }
            }
        })
        .state('advert.preview', {
            url: '/:advertId',
            resolve: {
                advert: function ($stateParams, NodesService) {
                    return NodesService.get($stateParams.advertId, 'advert');
                },
                images: function($stateParams, NodesService) {
                    return NodesService.images({nid: $stateParams.advertId});
                }
            },
            views: {
                'header': {
                    templateUrl: '/static/app/website/advert/header.html',
                    controller: ['$scope', 'advert', function ($scope, advert) {
                        $scope.advert = advert.result;
                    }]
                },
                'preview': {
                    templateUrl: '/static/app/website/advert/preview.html',
                    controller: ['$scope', '$sce', 'advert', 'images', function ($scope, $sce, advert, images) {
                        advert.result.text = $sce.trustAsHtml(advert.result.text);
                        $scope.images = images;
                        $scope.api = 'http://127.0.0.1:8001';
                        $scope.advert = advert.result;
                    }]
                },
                'aside': {
                    templateUrl: '/static/app/website/advert/preview.aside.html',
                    controller: ['$scope', 'advert', function ($scope, advert) {
                        $scope.advert = advert.result;
                    }]
                }
            }
        });
}]);
