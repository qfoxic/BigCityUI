angular.module('bigcity.users', [
  'ui.router',
  'ngResource'
])

.service('UsersService', ['$resource', '$http', '$rootScope',
  function ($resource, $http, $rootScope) {
      var userUrl = 'http://127.0.0.1:8001/user/',
          loginUrl = 'http://127.0.0.1:8001/login/',
          logoutUrl = 'http://127.0.0.1:8001/logout/',
          usersUrl = 'http://127.0.0.1:8001/users/',
          cache = $rootScope.cache,
          User = {},
          res = $resource(userUrl + ':userId/',
              {userId:'@id'},
              {update: {method: 'PUT'}});

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
      User.list = function(params) {
        return $http.get(usersUrl, params);
      };

      return User;
}])

.config(
  ['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('users', {
          abstract: true,
          url: '/users',
          templateUrl: '/static/app/users/main.html',
          controller: ['$scope', '$state', 'UsersService', 'notify',
            function ($scope, $state, UsersService, notify) {
              $scope.update = function(user, form) {
                var edited = {id: user.id};
                angular.forEach(form, function(prop, key) {
                  if (!key.startsWith('$') && prop.$dirty) {
                    edited[key] = prop.$viewValue;
                  }
                });
                UsersService.update(edited).then(
                  function(data) {
                      $scope.user = data.result;
                      notify.success('User was saved!');
                  },
                  function(err) {
                      notify.error(err.data.error);
                  });
              };
            }]
        })
        .state('users.list', {
          url: '/list',
          templateUrl: '/static/app/users/list.html',
          controller: ['$scope', '$state', 'UsersService',
            function ($scope, $state, UsersService) {
              $scope.users = {};
              $scope.loading = true;
              UsersService.list({}).then(
                  function(data) {
                    $scope.users = data.data.results;
                    $scope.loading = false;
                  });
           }]
        })
        .state('users.register', {
          url: '/register',
          templateUrl: '/static/app/users/edit.html',
          controller: ['$scope', '$state', 'UsersService',
            function ($scope, $state, UsersService) {
              $scope.user = {};
            }]
        })
        .state('users.profile', {
          url: '/profile',
          views: {
            '': {
              templateUrl: '/static/app/users/data.html',
              controller: ['$scope', '$stateParams', 'UsersService',
                function ($scope, $stateParams, UsersService) {
                  $scope.user = UsersService.current();
                }]
            }
          }
        })
        .state('users.update', {
          url: '/profile/:userId/update',
          views: {
            '': {
              templateUrl: '/static/app/users/edit.html',
              controller: ['$scope', '$stateParams', 'UsersService', 'notify',
                function ($scope, $stateParams, UsersService, notify) {
                  $scope.user = {};
                  UsersService.get($stateParams.userId).then(
                    function(data) {
                      $scope.user = data.result;
                    },
                    function(err) {
                      notify.error(err.data.error, 'error');
                    }
                  )
                }]
            }
          }
        })
        .state('users.detail', {
          url: '/profile/:userId',
          views: {
            '': {
              templateUrl: '/static/app/users/data.html',
              controller: ['$scope', '$stateParams', 'UsersService', 'notify',
                function ($scope, $stateParams, UsersService, notify) {
                  $scope.user = {};
                  UsersService.get($stateParams.userId).then(
                    function(data) {
                      $scope.user = data.result;
                    },
                    function(err) {
                      notify.error(err.data.error);
                    }
                  )
                }]
            }
          }
        })
    }
  ]
);
