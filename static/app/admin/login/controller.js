angular.module('bigcity.login', [
    'ui.router'
])

    .config(
    ['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: '/static/app/login/main.html',
                    controller: ['$scope', 'UsersService', '$state', 'notify',
                        function ($scope, UsersService, $state, notify) {
                            $scope.user = {};
                            $scope.login = function (user) {
                                UsersService.login(user).then(
                                    function (data) {
                                        $state.go('home');
                                    },
                                    function (err) {
                                        notify.error(err.data.error);
                                    });
                            };
                        }]
                })
                .state('logout', {
                    url: '/logout',
                    controller: ['$scope', 'UsersService', '$rootScope', '$state', 'notify',
                        function ($scope, UsersService, $rootScope, $state, notify) {
                            $scope.user = {};
                            $rootScope.logout = function () {
                                UsersService.logout().then(
                                    function (data) {
                                        $state.go('login');
                                    },
                                    function (err) {
                                        notify.error(err.data.error);
                                    });
                            };
                        }]
                })
        }
    ]
);
