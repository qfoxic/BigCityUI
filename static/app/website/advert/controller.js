angular.module('bigcity.website.advert', [
  'ui.router',
])

.config(
  ['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: '/static/app/website/home/main.html',
          controller: ['$scope', 'NodesService',
            function ($scope, NodesService) {
                $scope.nodes = {};
                $scope.subnodes = {};
                $scope.loading = true;
                NodesService.categories().then(function (data) {
                    $scope.nodes = data[0];
                    $scope.subnodes = data[1];
                    $scope.loading = false;
                }, function(error) {$scope.loading = false;});
            }]
        })
    }
  ]
);