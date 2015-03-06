angular.module('bigcity', [
  'bigcity.users',
  'bigcity.login',
  'ui.router', 
  'ngAnimate',
])
.run(
  ['$rootScope', '$state', '$stateParams',
  function ($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ]
)
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider
    .when('/users/', '/users/')
    .when('/login/', '/login/')
    .otherwise('/');

  $stateProvider
    .state('home', {
        url: '/'
    })
  }]
);