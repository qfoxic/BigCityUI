angular.module('bigcity', [
  'bigcity.users',
  'bigcity.login',
  'ui.router', 
  'ngAnimate',
  'LocalStorageModule'
])
.run(
  ['$rootScope', '$state', '$stateParams', 'localStorageService', '$http',
  function ($rootScope, $state, $stateParams, localStorageService, $http) {
      var curUser = localStorageService.get('usr');
      if (curUser) {
          $http.defaults.headers.common.Authorization = 'Token ' + curUser.token;
      }
      $rootScope.cache = localStorageService;
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ]
)
.config(['$stateProvider', '$urlRouterProvider', 'localStorageServiceProvider',
  function ($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
    localStorageServiceProvider
      .setStorageType('sessionStorage')
      .setNotify(false, false);

    $urlRouterProvider
      .when('/users/', '/users/')
      .when('/login/', '/login/')
      .otherwise('/');

    $stateProvider
      .state('home', {
        url: '/'
      })
  }
]);