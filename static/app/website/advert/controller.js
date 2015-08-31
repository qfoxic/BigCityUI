angular.module('bigcity.website.advert', [
    'ui.router'
])
    .config(['$stateProvider', function ($stateProvider) {
        'use strict';
        $stateProvider
            .state('advert', {
                url: '/advert',
                abstract: true,
                controller: ['$scope', 'NodesService', function ($scope, NodesService) {
                    //TODO. Constant.
                    $scope.api = 'http://api.bigcity.today';
                    $scope.getUploader = function (advertData, queueNumber, scope) {
                        var uploader = NodesService.uploader(advertData, queueNumber);
                        uploader.onSuccessItem = function (item, response) {
                            this.queueNumber -= 1;
                            item.remove();
                            scope.images.push(response.result);
                        };
                        return uploader;
                    };
                    $scope.removeImage = function (image, uploader, images) {
                        NodesService.removeImage(image.id).then(
                            function (data) {
                                var index = images.indexOf(image);
                                uploader.queueNumber += 1;
                                images.splice(index, 1);
                            },
                            function (error) {

                            }
                        );
                    };
                }]
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
                        controller: ['$scope', 'categories', 'NodesService', 'messages',
                            function ($scope, categories, NodesService, messages) {
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
                                $scope.images = [];
                                $scope.create = function (advert) {
                                    messages.info('Creating advert. Please wait...');
                                    NodesService.create(advert, 'advert').then(
                                        function (data) {
                                            messages.success('Advert was saved.');
                                            $scope.uploader = $scope.getUploader(data.result, 5, $scope);
                                        },
                                        function (data) {
                                            messages.error('Could not create advert. Please try again.');
                                        }
                                    );
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
                    images: function ($stateParams, NodesService) {
                        return NodesService.images({nid: $stateParams.advertId});
                    }
                },
                views: {
                    'preview': {
                        templateUrl: '/static/app/website/advert/edit.html',
                        controller: ['$scope', 'categories', 'advert', 'images', 'NodesService', 'messages',
                            function ($scope, categories, advert, images, NodesService, messages) {
                                var uploader = $scope.getUploader(advert.result, 5 - images.length, $scope);
                                $scope.grouped = categories ? categories[2] : [];
                                $scope.images = images;
                                $scope.advert = {
                                    id: advert.result.id,
                                    title: advert.result.title,
                                    price: advert.result.price,
                                    text: advert.result.text,
                                    location: advert.result.city + ', ' + advert.result.street,
                                    square_gen: advert.result.square_gen,
                                    room_height: advert.result.room_height,
                                    floor: advert.result.floor,
                                    square_live: advert.result.square_live,
                                    floors: advert.result.floors,
                                    rooms: advert.result.rooms,
                                    wall_type: advert.result.wall_type,
                                    build_type: advert.result.build_type,
                                    parent: advert.result.parent
                                };
                                $scope.uploader = uploader;

                                $scope.save = function (advert, form) {
                                    var edited = {id: advert.id};
                                    angular.forEach(form, function (prop, key) {
                                        if (!key.startsWith('$') && prop.$dirty) {
                                            edited[key] = prop.$viewValue;
                                        }
                                    });
                                    messages.info('Saving advert. Please wait...');
                                    NodesService.update(edited, 'advert').then(
                                        function (data) {
                                            messages.success('Advert was saved.');
                                        },
                                        function (error) {
                                            messages.error('Could not save advert. Please try again.');
                                        }
                                    );
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
                    images: function ($stateParams, NodesService) {
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
