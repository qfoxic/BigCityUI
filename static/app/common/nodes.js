angular.module('bigcity.common.nodes', [
  'ngResource'
])

.service('NodesService', ['$resource', '$http', '$rootScope',
  function ($resource, $http, $rootScope) {
      var nodesUrl = 'http://127.0.0.1:8001/node/',
          Node = {},
          res = $resource(nodeUrl + ':nid',
                          {nid:'@id'});

      Node.create = function(userData) {
          return res.save(userData).$promise;
      };
      User.update = function(userData) {
        return res.update(userData).$promise;
      };
      User.current = function() {
          return cache.get('usr') || {};
      };
      User.get = function(uid) {
        return res.get({userId: uid}).$promise;
      };
      User.delete = function(uid) {
        return res.remove({userId: uid}).$promise;
      };
      User.list = function(params) {
        return $http.get(usersUrl, params);
      };

      return User;
}])
