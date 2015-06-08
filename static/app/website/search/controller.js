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
              templateUrl: '/static/app/website/search/main.html'
            },
            'search@': {
              templateUrl: '/static/app/website/search/search.html',
              controller: ['$scope', 'NodesService',
                function ($scope, NodesService) {
                    NodesService.categories().then(function(data) {
                        $scope.grouped = data[2];
                    });
                }]
            }
          }
        })
        .state('search.category', {
          url: '/:categoryId'
        })
    }
  ]
);
