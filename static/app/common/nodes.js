angular.module('bigcity.common.nodes', [
  'ngResource'
])

.service('NodesService', ['$resource', '$rootScope',
  function ($resource, $rootScope) {
      var nodeUrl = 'http://127.0.0.1:8001/node/',
          nodesUrl = 'http://127.0.0.1:8001/nodes/:kind/',
          Node = {},
          res = $resource(nodeUrl + ':nid',
                          {nid:'@id'},
                          {
                              list: {method: 'GET', url: nodesUrl}
                          });

      Node.list = function(params) {
        return res.list(params).$promise;
      };

      return Node;
}])
