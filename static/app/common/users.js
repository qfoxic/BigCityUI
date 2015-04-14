angular.module('bigcity.common.users', [
  'ngResource'
])

.service('UsersService', ['$resource', '$http', '$rootScope',
  function ($resource, $http, $rootScope) {
      var userUrl = 'http://127.0.0.1:8001/user/',
          loginUrl = 'http://127.0.0.1:8001/login/',
          logoutUrl = 'http://127.0.0.1:8001/logout/',
          usersUrl = 'http://127.0.0.1:8001/users/',
          updGroups = 'http://127.0.0.1:8001/user/:userId/updgroups/',
          cache = $rootScope.cache,
          User = {},
          res = $resource(
              userUrl + ':userId/',
              {userId:'@id'},
              {
                update: {method: 'PUT'},
                updgroups: {method: 'POST', url: updGroups}
              }
          );

      User.login = function(userData) {
          var h =  $http.post(loginUrl, userData);

          h.then(function(resp) {
              var token = 'Token ' + resp.data.result.token;
              cache.clearAll();
              $rootScope.curUser = resp.data.result;
              cache.set('usr', resp.data.result);
              $http.defaults.headers.common.Authorization = token;
          });
          return h;
      };
      User.logout = function(userData) {
        var h =  $http.get(logoutUrl);

        h.then(function(resp) {
            cache.clearAll();
            $http.defaults.headers.common.Authorization = null;
            delete $rootScope.curUser;
        });
        return h;
      };
      User.create = function(userData) {
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
      User.updgroups = function(uid, gids) {
        return res.updgroups({id: uid, gids: gids}).$promise;
      }

      return User;
}])