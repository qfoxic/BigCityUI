angular.module('bigcity', [
    'bigcity.users',
    'bigcity.login',
    'bigcity.groups',
    'bigcity.nodes',
    'bigcity.home',
    'bigcity.common.messages',
    'bigcity.common.modal',
    'bigcity.common.users',
    'bigcity.common.groups',
    'bigcity.common.nodes',
    'bigcity.common.utils',
    'ui.router',
    'LocalStorageModule',
    'angularFileUpload'
])
    .constant('API_SERVER', 'http://127.0.0.1:8001')
    .constant('NODE_TYPES', {
        CATEGORY: 'category',
        ADVERT: 'advert'
    })
    .constant('CATEGORY_TYPES', {
        BUILDINGS: 'buildings'
    })
    .constant('NODE_MODELS', {
        category: {
            parent: null,
            title: null,
            uid: 1, // Hardcoded to root.
            ctype: 'buildings',
            perm: '666'
        }
    })
    //.constant('API_SERVER', 'api.bigcity.today')
    .run(['$rootScope', '$state', '$stateParams', 'localStorageService', '$http',
        function ($rootScope, $state, $stateParams, localStorageService, $http) {
            $rootScope.userCacheName = 'usr';
            $rootScope.curUser = localStorageService.get($rootScope.userCacheName);
            $rootScope.cache = localStorageService;
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            if ($rootScope.curUser) {
                $http.defaults.headers.common.Authorization = 'Token ' + $rootScope.curUser.token;
            }

            $rootScope.$on('$stateChangeStart', function (e, toState, toParams,
                                                          fromState, fromParams) {
                if (toState.name === 'login') {
                    return;
                }
                if (!$rootScope.curUser) {
                    $state.go('login');
                    e.preventDefault();
                }
            });
        }]
    )
    .config(['$stateProvider', '$urlRouterProvider', 'localStorageServiceProvider',
        '$resourceProvider',
        function ($stateProvider, $urlRouterProvider, localStorageServiceProvider,
                  $resourceProvider) {

            localStorageServiceProvider
                .setStorageType('sessionStorage')
                .setNotify(false, false);
            $resourceProvider.defaults.stripTrailingSlashes = false;

            $urlRouterProvider
                .when('/users/', '/users/')
                .when('/login/', '/login/')
                .when('/logout/', '/logout/')
                .when('/groups/', '/groups/')
                .when('/nodes/', '/nodes/')
                .otherwise('/');
        }
    ]);
