angular.module('bigcity.common.nodes', [
  'ngResource'
])

.service('NodesService', ['$resource', '$rootScope', '$q', 'utils',
  function ($resource, $rootScope, $q, utils) {
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
      Node.categories = function() {
          var pids = [], nodes = [], subnodes = [], merged = [], deferred = $q.defer();

          Node.list({page: 1, kind: 'category', where: 'parent is null'}).then(
            function(data) {
                nodes = data.results;
                // Merge pids to a comma separated string.
                angular.forEach(nodes,
                    function(val, key) {this.push('"'+val.id+'"');}, pids);
                Node.list({page: 1, kind: 'category', where: 'parent in ('+ pids.join() +')'}).then(
                    function(data) {
                        subnodes = data.results;
                        merged = utils.flattenTree(nodes, subnodes);
                        deferred.resolve([nodes, subnodes, merged]);
                    }, function(error) { deferred.reject(); });
            }, function(error) { deferred.reject(); });

            return deferred.promise;
      }
      return Node;
}])
