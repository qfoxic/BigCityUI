angular.module('bigcity', [
  'bigcity.users',
  'bigcity.login',
  'bigcity.groups',
  'bigcity.home',
  'bigcity.common.notification',
  'bigcity.common.modal',
  'bigcity.common.users',
  'bigcity.common.groups',
  'ui.router',
  'LocalStorageModule',
])
.run(
  ['$rootScope', '$state', '$stateParams', 'localStorageService', '$http', 'notify',
  function ($rootScope, $state, $stateParams, localStorageService, $http, notify) {
      $rootScope.curUser = localStorageService.get('usr');
      $rootScope.cache = localStorageService;
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      if ($rootScope.curUser) {
          $http.defaults.headers.common.Authorization = 'Token ' + $rootScope.curUser.token;
      }

      $rootScope.$on('$stateChangeStart', function(e, toState, toParams,
          fromState, fromParams) {
        if (toState.name === 'login') {
          return;
        }
        if(!$rootScope.curUser) {
          $state.go('login');
          e.preventDefault();
        }
      });
    }
  ]
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
      .otherwise('/');
  }
]);
