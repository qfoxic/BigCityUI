angular.module('bigcity', [
    'bigcity.website.home',
    'bigcity.website.search',
    'bigcity.website.advert',
    'bigcity.common.notification',
    'bigcity.common.modal',
    'bigcity.common.users',
    'bigcity.common.groups',
    'bigcity.common.nodes',
    'bigcity.common.utils',
    'ui.router',
    'LocalStorageModule'
])
    .run(
        ['$rootScope', '$state', '$stateParams', 'localStorageService', '$http',
            function ($rootScope, $state, $stateParams, localStorageService, $http) {
                'use strict';
                $rootScope.curUser = localStorageService.get('usr');
                $rootScope.cache = localStorageService;
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;

                if ($rootScope.curUser) {
                    $http.defaults.headers.common.Authorization = 'Token ' + $rootScope.curUser.token;
                }
            }]
    )
    .config(['$urlRouterProvider', 'localStorageServiceProvider', '$resourceProvider',
        function ($urlRouterProvider, localStorageServiceProvider, $resourceProvider) {
            'use strict';
            localStorageServiceProvider
                .setStorageType('sessionStorage')
                .setNotify(false, false);
            $resourceProvider.defaults.stripTrailingSlashes = false;

            $urlRouterProvider
                .when('/', '/')
                .when('/search/', '/search/')
                .when('/login/', '/login/')
                .when('/logout/', '/logout/')
                .when('/groups/', '/groups/')
                .when('/nodes/', '/nodes/')
                .otherwise('/');
        }]
);
