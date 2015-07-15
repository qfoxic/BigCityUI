angular.module('bigcity.website.user', [
    'ui.router'
]).config(['$stateProvider', function ($stateProvider) {
    'use strict';
    $stateProvider
        .state('user', {
            url: '/user',
            abstract: true
        })
        .state('user.logout', {
            url: '/logout',
            views: {
                preview: {
                    controller: ['UsersService', '$state',
                        function (UsersService, $state) {
                            UsersService.logout().then(function () {
                                $state.go('home');
                            });
                        }]
                }
            }
        })
        .state('user.create', {
            url: '/create',
            views: {
                'preview': {
                    templateUrl: '/static/app/website/user/create.html',
                    controller: ['$scope', 'UsersService', '$state',
                        function ($scope, UsersService, $state) {
                            $scope.conditions = false;
                            $scope.user = {
                                first_name: null,
                                last_name: null,
                                phone: null,
                                address: null,
                                gender: null,
                                password: null,
                                email: null,
                                resume: null
                            };
                            $scope.create = function (user) {
                                UsersService.create(user).then(
                                    function (data) {
                                        UsersService.login({
                                            username: data.result.username,
                                            password: user.password
                                        }).then(function () {
                                            $state.go('user.preview', {userId: data.result.id});
                                        });
                                    },
                                    function (error) {
                                        // TODO. Do something.
                                    }
                                );
                            };
                        }]
                },
                'aside': {
                    templateUrl: '/static/app/website/user/aside.html'
                }
            }
        })
        .state('user.preview', {
            url: '/:userId',
            resolve: {
                advert: function ($stateParams, NodesService) {
                    return NodesService.get($stateParams.advertId, 'advert');
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
                    controller: ['$scope', '$sce', 'advert', function ($scope, $sce, advert) {
                        advert.result.text = $sce.trustAsHtml(advert.result.text);
                        $scope.advert = advert.result;
                    }]
                },
                'aside': {
                    templateUrl: '/static/app/website/advert/aside.html',
                    controller: ['$scope', 'advert', function ($scope, advert) {
                        $scope.advert = advert.result;
                    }]
                }
            }
        });
}]);
