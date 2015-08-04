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
                    controller: ['UsersService', '$state', '$scope', 'messages',
                        function (UsersService, $state, $scope, messages) {
                            $scope.username = null;
                            $scope.password = null;
                            // Hack. Used only to correct a html layout.
                            $scope.loginPage = true;
                            $scope.login = function () {
                                UsersService.login({
                                    username: $scope.username,
                                    password: $scope.password
                                }).then(
                                    function (data) {
                                        $state.go('user.preview', {userId: data.data.result.id});
                                    },
                                    function (resp) {
                                        messages.error('Could not sign in a user. Password or an email was incorrect.');
                                    }
                                );
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
                                $state.go('user.login');
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
                    controller: ['$scope', 'UsersService', '$state', 'messages',
                        function ($scope, UsersService, $state, messages) {
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
                                        messages.error('Could not create a user. Please try again.');
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
                    controller: ['$scope', 'user', 'UsersService', 'messages',
                        function ($scope, user, UsersService, messages) {
                            $scope.userProfile = true;
                            $scope.user = user.result;
                            $scope.chpasswd = {
                                password: null,
                                password1: null
                            };
                            $scope.submit = function (user) {
                                messages.info('Updating the user. Please wait ...');
                                UsersService.update(user).then(
                                    function (data) {
                                        messages.success('The user was updated.');
                                    },
                                    function (resp) {
                                        messages.error('Could not update the user. Please try again.');
                                    }
                                );
                            };
                            $scope.chpasswd = function (user, password) {
                                UsersService.chpasswd(user.id, password).then(
                                    function (data) {
                                        messages.success('Password was changed.');
                                    },
                                    function (resp) {
                                        messages.error('Could not update a password. Please try again.');
                                    }
                                );
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
                    controller: ['$scope', 'user', 'NodesService', 'messages',
                        function ($scope, user, NodesService, messages) {
                            $scope.userProfile = true;
                            $scope.user = user.result;
                            $scope.adverts = null;
                            $scope.removeAdvert = function (advert) {
                                messages.info('Removing an advert. Please wait ...');
                                NodesService.delete({nid: advert.id}, 'advert').then(
                                    function (data) {
                                        var index = $scope.adverts.indexOf(advert);
                                        $scope.adverts.splice(index, 1);
                                        messages.success('Advert was removed.');
                                    },
                                    function (error) {
                                        messages.error('Could not remove advert. Please try again.');
                                    }
                                );
                            };
                            NodesService.list({kind: 'advert', where: 'uid=' + user.result.id, order: 'updated'}).then(
                                function (data) {
                                    $scope.adverts = data.results;
                                }
                            );
                        }]
                }
            }
        });
}]);
