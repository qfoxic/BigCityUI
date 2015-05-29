angular.module('bigcity.website.home', [
  'ui.router',
])

.config(
  ['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('home', {
          url: '/',
          views: {
            '': {
              templateUrl: '/static/app/website/home/main.html',
              controller: ['$scope','$state', '$stateParams',
                function ($scope, $state, $stateParams) {
                }]
            },
            'search@': {
              templateUrl: '/static/app/website/home/search.html',
              controller: ['$scope','$state', '$stateParams',
                function ($scope, $state, $stateParams) {
                }]
            }
          }
        })
    }
  ]
);
