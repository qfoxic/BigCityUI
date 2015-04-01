angular.module('bigcity.common.groups', [
  'ngResource'
])

.service('GroupsService', ['$resource', '$http', '$rootScope',
  function ($resource, $http, $rootScope) {
      var groupUrl = 'http://127.0.0.1:8001/group/',
          cache = $rootScope.cache,
          Group = {},
          res = $resource(groupUrl + ':groupId/',
              {groupId:'@id'},
              {update: {method: 'PUT'}});

      Group.create = function(data) {
          return res.save(data).$promise;
      };
      Group.update = function(data) {
        return res.update(data).$promise;
      };
      Group.get = function(gid) {
        return res.get({groupId: gid}).$promise;
      };
      Group.delete = function(gid) {
        return res.remove({groupId: gid}).$promise;
      };
      Group.list = function(params) {
        return $http.get(groupUrl, params);
      };

      return Group;
}])