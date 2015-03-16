angular.module('bigcity', [
  'bigcity.users',
  'bigcity.login',
  'bigcity.home',
  'ui.router',
  'ui.bootstrap',
  'LocalStorageModule'
])
.run(
  ['$rootScope', '$state', '$stateParams', 'localStorageService', '$http',
  function ($rootScope, $state, $stateParams, localStorageService, $http) {
      var curUser = localStorageService.get('usr');
      $rootScope.cache = localStorageService;
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      if (curUser) {
          $http.defaults.headers.common.Authorization = 'Token ' + curUser.token;
          $rootScope.curUser = curUser;
      }

      $rootScope.$on('$stateChangeStart', function(e, toState, toParams,
          fromState, fromParams) {
        if (fromState.name === toState.name) {
          return;
        }
        if(!curUser) {
          e.preventDefault();
          $state.go('login');
        } else if (curUser) {
          e.preventDefault();
          $state.go('home');
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
      .otherwise('/');
  }
]);