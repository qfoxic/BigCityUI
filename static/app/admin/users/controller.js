angular.module('bigcity.users', [
    'ui.router'
])

    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider) {
            'use strict';
            $stateProvider
                .state('users', {
                    abstract: true,
                    url: '/users',
                    templateUrl: '/static/app/users/main.html',
                    controller: ['$scope', '$state', 'UsersService', 'GroupsService', 'notify', 'modal',
                        function ($scope, $state, UsersService, GroupsService, notify, modal) {
                            $scope.groups = [];
                            GroupsService.list({}).then(
                                function (data) {
                                    $scope.groups = data.data.result;
                                });
                            $scope.update = function (user, form) {
                                var edited = {id: user.id},
                                    gids = [];
                                gids = angular.forEach(user.groups, function (prop) {
                                    gids.push(prop.id);
                                });
                                angular.forEach(form, function (prop, key) {
                                    if (!key.startsWith('$') && prop.$dirty) {
                                        edited[key] = prop.$viewValue;
                                    }
                                });
                                UsersService.update(edited).then(
                                    function (data) {
                                        UsersService.updgroups(user.id, gids).then(
                                            function () {
                                                $scope.user = data.result;
                                                notify.success('User was saved!');
                                            }
                                        );
                                    },
                                    function (err) {
                                        notify.error(err.data.error);
                                    }
                                );
                            };
                            $scope.create = function (form) {
                                var edited = {};
                                angular.forEach(form, function (prop, key) {
                                    if (!key.startsWith('$') && prop.$dirty) {
                                        edited[key] = prop.$viewValue;
                                    }
                                });
                                UsersService.create(edited).then(
                                    function () {
                                        $state.go('users.list');
                                        notify.success('User was created!');
                                    },
                                    function (err) {
                                        notify.error(err.data.error);
                                    }
                                );
                            };
                            $scope.delete = function (user, index) {
                                modal.warning(
                                    'Warning!',
                                    'Are sure you want to remove a user ' + user.email,
                                    function () {
                                        UsersService.delete(user.id).then(
                                            function (data) {
                                                $scope.users.splice(index, 1);
                                                notify.success('User was deleted!');
                                            },
                                            function (err) {
                                                notify.error(err.data.error);
                                            });
                                    }
                                );
                            };
                        }]
                })
                .state('users.list', {
                    url: '/list',
                    templateUrl: '/static/app/users/list.html',
                    controller: ['$scope', '$state', 'UsersService',
                        function ($scope, $state, UsersService) {
                            $scope.$parent.users = {};
                            $scope.loading = true;
                            UsersService.list({}).then(
                                function (data) {
                                    $scope.$parent.users = data.data.results;
                                    $scope.loading = false;
                                });
                        }]
                })
                .state('users.create', {
                    url: '/create',
                    views: {
                        '': {
                            templateUrl: '/static/app/users/create.html',
                            controller: ['$scope', '$stateParams', 'UsersService', 'notify',
                                function ($scope, $stateParams, UsersService, notify) {
                                    $scope.user = {};
                                }]
                        }
                    }
                })
                .state('users.profile', {
                    url: '/profile',
                    views: {
                        '': {
                            templateUrl: '/static/app/users/data.html',
                            controller: ['$scope', '$stateParams', 'UsersService',
                                function ($scope, $stateParams, UsersService) {
                                    $scope.user = UsersService.current();
                                }]
                        }
                    }
                })
                .state('users.update', {
                    url: '/profile/:userId/update',
                    views: {
                        '': {
                            templateUrl: '/static/app/users/edit.html',
                            controller: ['$scope', '$stateParams', 'UsersService', 'notify',
                                function ($scope, $stateParams, UsersService, notify) {
                                    $scope.user = {};
                                    UsersService.get($stateParams.userId).then(
                                        function (data) {
                                            $scope.user = data.result;
                                        },
                                        function (err) {
                                            notify.error(err.data.error, 'error');
                                        }
                                    );
                                }]
                        }
                    }
                })
                .state('users.detail', {
                    url: '/profile/:userId',
                    views: {
                        '': {
                            templateUrl: '/static/app/users/data.html',
                            controller: ['$scope', '$stateParams', 'UsersService', 'notify',
                                function ($scope, $stateParams, UsersService, notify) {
                                    $scope.user = {};
                                    UsersService.get($stateParams.userId).then(
                                        function (data) {
                                            $scope.user = data.result;
                                        },
                                        function (err) {
                                            notify.error(err.data.error);
                                        }
                                    );
                                }]
                        }
                    }
                });
        }
    ]
);
