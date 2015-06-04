angular.module('bigcity.common.nodes', [
  'ngResource'
])

.service('NodesService', ['$resource', '$rootScope',
  function ($resource, $rootScope) {
      var nodeUrl = 'http://127.0.0.1:8001/node/',
          nodesUrl = 'http://127.0.0.1:8001/nodes/:kind/',
          Node = {},
          res = $resource(nodeUrl + ':nid/',
                          {nid:'@id'},
                          {
                              list: {method: 'GET', url: nodesUrl}
                          });

      Node.list = function(params) {
        return res.list(params).$promise;
      };
      Node.get = function(nid) {
        return res.get({nid: nid}).$promise;
      };
      Node.categories = function($scope, showLoader) {
        $scope.nodes = {};
        $scope.subnodes = {};
        $scope.loading = showLoader;
        Node.list({page: 1, kind: 'category', where: 'parent is null'}).then(
            function(data) {
              $scope.nodes = data;
              $scope.loading = false;
            },
            function(error){
              $scope.loading = false;
            });
        $scope.$watch('nodes', function(newValue, oldValue) {
          var isEmpty = angular.equals({}, newValue),
              pids = [];
          if (!isEmpty) {
            angular.forEach(newValue.results,
                function(val, key) {this.push('"'+val.id+'"');}, pids);
            Node.list({page: 1, kind: 'category', where: 'parent in ('+ pids.join() +')'}).then(
              function(data) {
                  $scope.subnodes = data;
              });
          }
        });
      }
      return Node;
}])
