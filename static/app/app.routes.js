angular.module('bigcity', [
    'bigcity.website.home',
    'bigcity.website.search',
    'bigcity.website.advert',
    'bigcity.website.user',
    'bigcity.common.messages',
    'bigcity.common.modal',
    'bigcity.common.users',
    'bigcity.common.groups',
    'bigcity.common.nodes',
    'bigcity.common.utils',
    'ui.router',
    'ui.bootstrap',
    'LocalStorageModule',
    'angularFileUpload',
    'pascalprecht.translate'
])
    .constant('API_SERVER', 'http://127.0.0.1:8001')
    //.constant('API_SERVER', 'api.bigcity.today')
    .run(['$rootScope', '$state', '$stateParams', 'localStorageService', '$http',
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

            $rootScope.$on('$stateChangeStart', function () {
                angular.element('#wrapper').toggleClass('whirl traditional');
            });
            $rootScope.$on('$stateChangeSuccess', function () {
                angular.element('#wrapper').toggleClass('whirl traditional');
            });
        }])

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
    )
    .config(['$translateProvider', function ($translateProvider) {
        $translateProvider.translations('en_EN', {
            'LOGIN':'Login',
            'SIGNUP': 'Signup',
            'POST_FREE_ADD': 'Post Free Add',
            'FIND_CLASSIFIED_ADS_H1': 'Find classified ads',
            'FIND_CLASSIFIED_ADS_P': 'Find local classified ads on Bigcity in Minutes',
            'LOCATION': 'Location...',
            'I_AM_LOOKING_FOR': 'I\'m looking for a ...',
            'FIND': 'Find'
        });
        $translateProvider.translations('ua_UA', {
            'LOGIN':'Ввійти',
            'SIGNUP': 'Зареєструватись',
            'POST_FREE_ADD': 'Додати Оголошення',
            'FIND_CLASSIFIED_ADS_H1': 'Знайти оголошення',
            'FIND_CLASSIFIED_ADS_P': 'Знайти місцеві оголошення в Bigcity',
            'LOCATION': 'Місцезнаходження...',
            'I_AM_LOOKING_FOR': 'Я намагаюсь знайти ...',
            'FIND': 'Пошук'

        });
        $translateProvider.use('ua_UA');
    }]
);

