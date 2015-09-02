angular.module('bigcity.login', [
    'ui.router'
])

    .config(
    ['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: '/static/app/admin/login/main.html',
                    controller: ['$scope', 'UsersService', '$state', 'messages',
                        function ($scope, UsersService, $state, messages) {
                            $scope.user = {};
                            $scope.login = function (user) {
                                UsersService.login(user).then(
                                    function (data) {
                                        $state.go('home');
                                    },
                                    function (err) {
                                        messages.error(err.data.error);
                                    });
                            };
                        }]
                })
                .state('logout', {
                    url: '/logout',
                    controller: ['$scope', 'UsersService', '$rootScope', '$state', 'messages',
                        function ($scope, UsersService, $rootScope, $state, messages) {
                            $scope.user = {};
                            $rootScope.logout = function () {
                                UsersService.logout().then(
                                    function (data) {
                                        $state.go('login');
                                    },
                                    function (err) {
                                        messages.error(err.data.error);
                                    });
                            };
                        }]
                })
        }
    ]
);
