angular.module('bigcity.users', [
  'ui.router',
  'ngResource'
])


.service('UsersService', ['$resource', '$http', '$rootScope',
  function ($resource, $http, $rootScope) {
      var userUrl = 'http://127.0.0.1:8001/user/',
          loginUrl = 'http://127.0.0.1:8001/login/',
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
              cache.set('usr', resp.data.result);
              $http.defaults.headers.common.Authorization = token;
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
      return User;
}])

.config(
  ['$stateProvider', '$urlRouterProvider', '$resourceProvider',
    function ($stateProvider,   $urlRouterProvider, $resourceProvider) {
      $resourceProvider.defaults.stripTrailingSlashes = false;
      $stateProvider
        .state('users', {
          abstract: true,
          url: '/users',
          templateUrl: '/static/app/users/main.html',
          controller: ['$scope', '$state', 'UsersService',
            function ($scope, $state, UsersService) {
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
                  },
                  function(err) {
                      alert(err.data.error);
                  });
              };
            }]
        })
        .state('users.list', {
          url: '/list',
          templateUrl: '/static/app/users/list.html'
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
              controller: ['$scope', '$stateParams', 'UsersService',
                function ($scope, $stateParams, UsersService) {
                  $scope.user = {};
                  UsersService.get($stateParams.userId).then(
                    function(data) {
                      $scope.user = data.result;
                    },
                    function(err) {
                      alert(err.data.error);
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
              controller: ['$scope', '$stateParams', 'UsersService',
                function ($scope, $stateParams, UsersService) {
                  $scope.user = {};
                  UsersService.get($stateParams.userId).then(
                    function(data) {
                      $scope.user = data.result;
                    },
                    function(err) {
                      alert(err.data.error);
                    }
                  )
                }]
            }
          }
        })
        //////////////////////////////
        // Contacts > Detail > Item //
        //////////////////////////////
/*
        .state('contacts.detail.item', {

          // So following what we've learned, this state's full url will end up being
          // '/contacts/{contactId}/item/:itemId'. We are using both types of parameters
          // in the same url, but they behave identically.
          url: '/item/:itemId',
          views: {

            // This is targeting the unnamed ui-view within the parent state 'contact.detail'
            // We wouldn't have to do it this way if we didn't also want to set the 'hint' view below.
            // We could instead just set templateUrl and controller outside of the view obj.
            '': {
              templateUrl: 'app/contacts/contacts.detail.item.html',
              controller: ['$scope', '$stateParams', '$state', 'utils',
                function (  $scope,   $stateParams,   $state,   utils) {
                  $scope.item = utils.findById($scope.contact.items, $stateParams.itemId);

                  $scope.edit = function () {
                    // Here we show off go's ability to navigate to a relative state. Using '^' to go upwards
                    // and '.' to go down, you can navigate to any relative state (ancestor or descendant).
                    // Here we are going down to the child state 'edit' (full name of 'contacts.detail.item.edit')
                    $state.go('.edit', $stateParams);
                  };
                }]
            },

            // Here we see we are overriding the template that was set by 'contacts.detail'
            'hint@': {
              template: ' This is contacts.detail.item overriding the "hint" ui-view'
            }
          }
        })

        /////////////////////////////////////
        // Contacts > Detail > Item > Edit //
        /////////////////////////////////////
*/
        // Notice that this state has no 'url'. States do not require a url. You can use them
        // simply to organize your application into "places" where each "place" can configure
        // only what it needs. The only way to get to this state is via $state.go (or transitionTo)
/*
        .state('contacts.detail.item.edit', {
          views: {

            // This is targeting the unnamed view within the 'contacts.detail' state
            // essentially swapping out the template that 'contacts.detail.item' had
            // inserted with this state's template.
            '@contacts.detail': {
              templateUrl: 'app/contacts/contacts.detail.item.edit.html',
              controller: ['$scope', '$stateParams', '$state', 'utils',
                function (  $scope,   $stateParams,   $state,   utils) {
                  $scope.item = utils.findById($scope.contact.items, $stateParams.itemId);
                  $scope.done = function () {
                    // Go back up. '^' means up one. '^.^' would be up twice, to the grandparent.
                    $state.go('^', $stateParams);
                  };
                }]
            }
          }
        });
*/
    }
  ]
);