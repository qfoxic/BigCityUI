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
          res = $resource(userUrl + ':userId/', {userId:'@id'});

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
      User.save = function(userData) {
          return res.save(userData).$promise;
      };
      User.current = function() {
          return cache.get('usr') || {};
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
          controller: ['$scope', '$state',
            function ($scope, $state) {
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
              $scope.update = function(user) {
                  UsersService.save(user).then(
                    function(data) {
                        $scope.user = data.result;
                    },
                    function(err) {
                        alert(err.data.error);
                    });
              };
            }]
        })
        .state('users.profile', {
          url: '/profile',
          views: {
            '': {
              templateUrl: '/static/app/users/data.html',
              controller: ['$scope', '$stateParams', 'UsersService',
                function (  $scope, $stateParams, UsersService) {
                  $scope.user = UsersService.current();
                }]
            },

            // This one is targeting the ui-view="hint" within the unnamed root, aka index.html.
            // This shows off how you could populate *any* view within *any* ancestor state.
            //'hint@': {
            //  template: 'This is contacts.detail populating the "hint" ui-view'
            //},

            // This one is targeting the ui-view="menuTip" within the parent state's template.
            //'menuTip': {
              // templateProvider is the final method for supplying a template.
              // There is: template, templateUrl, and templateProvider.
            //  templateProvider: ['$stateParams',
            //    function (        $stateParams) {
                  // This is just to demonstrate that $stateParams injection works for templateProvider.
                  // $stateParams are the parameters for the new state we're transitioning to, even
                  // though the global '$stateParams' has not been updated yet.
            //      return '<hr><small class="muted">Contact ID: ' + $stateParams.contactId + '</small>';
            //    }]
            //}
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