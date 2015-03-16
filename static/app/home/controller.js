angular.module('bigcity.home', [
  'ui.router',
  'bigcity.users',
  'ui.bootstrap',
])

.config(
  ['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('home', {
          url: '/',
          views: {
            '': {
              templateUrl: '/static/app/home/main.html',
              controller: ['$scope', '$stateParams', 'UsersService',
                function ($scope, $stateParams, UsersService) {
                }]
            }
          }
        })
    }
  ]
);