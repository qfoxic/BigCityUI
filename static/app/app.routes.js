angular.module('bigcity', [
    'bigcity.website.home',
    'bigcity.website.search',
    'bigcity.website.advert',
    'bigcity.website.user',
    'bigcity.common.notification',
    'bigcity.common.modal',
    'bigcity.common.users',
    'bigcity.common.groups',
    'bigcity.common.nodes',
    'bigcity.common.utils',
    'ui.router',
    'ui.bootstrap',
    'LocalStorageModule',
    'angularFileUpload'
])
    // TODO. Replace All possible values with that.
    .constant('API_SERVER', 'http://127.0.0.1')
    .run(
    ['$rootScope', '$state', '$stateParams', 'localStorageService', '$http',
        function ($rootScope, $state, $stateParams, localStorageService, $http) {
            'use strict';
            $rootScope.userCacheName = 'webusr'; // TODO. This is a constant.
            $rootScope.curUser = localStorageService.get($rootScope.userCacheName);
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
                .when('/search/', '/search/all')
                .when('/advert/', '/advert/')
                .when('/login/', '/login/')
                .when('/logout/', '/logout/')
                .otherwise('/');
        }]
);
