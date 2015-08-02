angular.module('bigcity.website.user', [
    'ui.router'
]).config(['$stateProvider', function ($stateProvider) {
    'use strict';
    $stateProvider
        .state('user', {
            url: '/user',
            abstract: true
        })
        .state('user.login', {
            url: '/login',
            views: {
                preview: {
                    templateUrl: '/static/app/website/user/login.html',
                    controller: ['UsersService', '$state', '$scope',
                        function (UsersService, $state, $scope) {
                            $scope.username = null;
                            $scope.password = null;
                            // Hack. Used only to correct a html layout.
                            $scope.loginPage = true;
                            $scope.login = function () {
                                UsersService.login({
                                    username: $scope.username,
                                    password: $scope.password
                                }).then(function (data) {
                                    $state.go('user.preview', {userId: data.data.result.id});
                                });
                            };
                        }]
                }
            }
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
                user: function ($stateParams, UsersService) {
                    return UsersService.get($stateParams.userId);
                }
            },
            views: {
                'preview': {
                    templateUrl: '/static/app/website/user/profile.html',
                    controller: ['$scope', 'user', 'UsersService', function ($scope, user, UsersService) {
                        $scope.userProfile = true;
                        $scope.user = user.result;
                        $scope.submit = function(user) {
                            // TODO. Add callbacks to handle success and fail.
                            UsersService.update(user);
                        };
                    }]
                },
                'laside': {
                    templateUrl: '/static/app/website/user/laside.profile.html',
                    controller: ['$scope', 'user', function ($scope, user) {
                        $scope.userProfile = true;
                        $scope.user = user.result;
                    }]
                }
            }
        })
        .state('user.preview.myads', {
            url: '/myads',
            views: {
                '': {
                    templateUrl: '/static/app/website/user/profile.myads.html',
                    controller: ['$scope', 'user', 'NodesService', function ($scope, user, NodesService) {
                        $scope.userProfile = true;
                        $scope.user = user.result;
                        $scope.adverts = null;
                        $scope.removeAdvert = function (advert) {
                            NodesService.delete({nid: advert.id}, 'advert').then(
                                function (data) {
                                    var index = $scope.adverts.indexOf(advert);
                                    $scope.adverts.splice(index, 1);
                                },
                                function (error) {
                                    //TODO. Handle error.
                                }
                            );
                        };
                        NodesService.list({kind: 'advert', where: 'uid=' + user.result.id, order: 'updated'}).then(
                            function (data) {
                                $scope.adverts = data.results;
                            },
                            function (error) {

                            }
                        );
                    }]
                }
            }
        });
}]);
