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
                        deferred.resolve([nodes, subnodes, merged.flattenArr, merged.flattenDict]);
                    }, function(error) { deferred.reject(); });
            }, function(error) { deferred.reject(); });

            return deferred.promise;
      };
      Node.adverts = function(category, direct) {
          return res.list({kind: 'advert', table: 'children',
                           tparams: 'pid=' + category.id + ',direct=' + direct}).$promise;
      };
      Node.nearestAds = function(params) {
          //location, price_from, price_to, order_by, parent, text
          var priceTo = params.priceTo ? params.priceTo : '9999999999.0',
              priceFrom = params.priceFrom ? params.priceFrom : '0',
              whereCond = (params.text ? 'text like "' + params.text + '" and ' : '') +
                          ('(price >= ' + priceFrom + ' and price <= ' +
                           priceTo + ')')
          // Resolve location, add current location if nothing was specified.
          // add $http to root scope.
          // http://maps.googleapis.com/maps/api/geocode/json?address='Sambir'
          return res.list({kind: 'advert', table: 'nearest',
                           tparams: 'parent=' + params.parent,
                           where: whereCond}).$promise;
      }
      return Node;
}])
