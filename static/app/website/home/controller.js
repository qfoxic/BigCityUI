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
              controller: ['$scope','$state', '$stateParams', 'NodesService',
                function ($scope, $state, $stateParams, NodesService) {
                    // TODO. Make this generic.
                    $scope.list = function(page, kind, expr, container, showLoader) {
                      if (page < 1 || page > $scope.pages) {
                        return;
                      }
                      $scope.page = page;
                      $scope[container] = {};
                      $scope.pages = 0;
                      $scope.loading = showLoader;
                      NodesService.list({page: page, kind: kind, where: expr}).then(
                          function(data) {
                            $scope[container] = data;
                            $scope.pages = Math.ceil(data.count/50);
                            $scope.loading = false;
                          },
                          function(error){
                            $scope.loading = false;
                          });
                    };
                    $scope.list(1, 'category', 'parent is null', 'nodes', true);
                    $scope.$watch('nodes', function(newValue, oldValue) {
                        var isEmpty = angular.equals({}, newValue),
                            pids = [];
                        if (!isEmpty) {
                            angular.forEach(newValue.results,
                                function(val, key) {
                                    this.push('"'+val.id+'"');
                                },
                                pids);
                            $scope.list(1, 'category', 'parent in ('+ pids.join() +')', 'subnodes');
                        }
                    });
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
