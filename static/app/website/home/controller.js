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
              controller: ['$scope', 'NodesService',
                function ($scope, NodesService) {
                    NodesService.categories($scope, true);
                }]
            },
            'search@': {
                templateUrl: '/static/app/website/home/search.html'
            }
          }
        })
    }
  ]
);
