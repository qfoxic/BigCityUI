angular.module('bigcity.website.search', [
  'ui.router',
])

.config(
  ['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('search', {
          url: '/search',
          views: {
            '': {
              templateUrl: '/static/app/website/search/main.html',
              controller: ['$scope', 'NodesService',
                function ($scope, NodesService) {
                    NodesService.categories($scope, true);
                }]
            },
            'search@': {
              templateUrl: '/static/app/website/search/search.html'
            }
          }
        })
        .state('search.category', {
          url: '/:categoryId'
        })
    }
  ]
);
