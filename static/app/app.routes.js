angular.module('bigcity', [
  'bigcity.website.home',
  'bigcity.common.notification',
  'bigcity.common.modal',
  'bigcity.common.users',
  'bigcity.common.groups',
  'bigcity.common.nodes',
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
      $rootScope.$on("$stateChangeError", console.log.bind(console));
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
      .when('/', '/')
      .when('/login/', '/login/')
      .when('/logout/', '/logout/')
      .when('/groups/', '/groups/')
      .when('/nodes/', '/nodes/')
      .otherwise('/');
  }
]);
