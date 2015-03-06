angular.module('bigcity.users', [
  'ui.router',
  'ngResource'
])


.service('UsersService', ['$resource', '$http', function ($resource, $http) {
  var userUrl = 'http://127.0.0.1:8001/user/',
      loginUrl = 'http://127.0.0.1:8001/login/',
      User = $resource(userUrl + ':userId', {userId:'@id'});

  User.login = function(userData) {
      var h =  $http.post(loginUrl, userData);

      h.then(function(resp) {
          var token = 'Token ' + resp.data.result.token;
          $http.defaults.headers.common.Authorization = token;
          $http.get('http://127.0.0.1:8001/user/5/')
      });
      return h;
  };
  User.save = function(userData) {
      return res.save(userData).$promise;
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

          // Using an empty url means that this child state will become active
          // when its parent's url is navigated to. Urls of child states are
          // automatically appended to the urls of their parent. So this state's
          // url is '/contacts' (because '/contacts' + '').
          url: '',

          // IMPORTANT: Now we have a state that is not a top level state. Its
          // template will be inserted into the ui-view within this state's
          // parent's template; so the ui-view within contacts.html. This is the
          // most important thing to remember about templates.
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

        ///////////////////////
        // Contacts > Detail //
        ///////////////////////

        // You can have unlimited children within a state. Here is a second child
        // state within the 'contacts' parent state.
/*        .state('users.detail', {

          // Urls can have parameters. They can be specified like :param or {param}.
          // If {} is used, then you can also specify a regex pattern that the param
          // must match. The regex is written after a colon (:). Note: Don't use capture
          // groups in your regex patterns, because the whole regex is wrapped again
          // behind the scenes. Our pattern below will only match numbers with a length
          // between 1 and 4.

          // Since this state is also a child of 'contacts' its url is appended as well.
          // So its url will end up being '/contacts/{contactId:[0-9]{1,4}}'. When the
          // url becomes something like '/contacts/42' then this state becomes active
          // and the $stateParams object becomes { contactId: 42 }.
          url: '/{userId:[0-9]{1,4}}',

          // If there is more than a single ui-view in the parent template, or you would
          // like to target a ui-view from even higher up the state tree, you can use the
          // views object to configure multiple views. Each view can get its own template,
          // controller, and resolve data.

          // View names can be relative or absolute. Relative view names do not use an '@'
          // symbol. They always refer to views within this state's parent template.
          // Absolute view names use a '@' symbol to distinguish the view and the state.
          // So 'foo@bar' means the ui-view named 'foo' within the 'bar' state's template.
          views: {

            // So this one is targeting the unnamed view within the parent state's template.
            '': {
              templateUrl: 'app/contacts/contacts.detail.html',
              controller: ['$scope', '$stateParams', 'utils',
                function (  $scope,   $stateParams,   utils) {
                  $scope.contact = utils.findById($scope.contacts, $stateParams.contactId);
                }]
            },

            // This one is targeting the ui-view="hint" within the unnamed root, aka index.html.
            // This shows off how you could populate *any* view within *any* ancestor state.
            'hint@': {
              template: 'This is contacts.detail populating the "hint" ui-view'
            },

            // This one is targeting the ui-view="menuTip" within the parent state's template.
            'menuTip': {
              // templateProvider is the final method for supplying a template.
              // There is: template, templateUrl, and templateProvider.
              templateProvider: ['$stateParams',
                function (        $stateParams) {
                  // This is just to demonstrate that $stateParams injection works for templateProvider.
                  // $stateParams are the parameters for the new state we're transitioning to, even
                  // though the global '$stateParams' has not been updated yet.
                  return '<hr><small class="muted">Contact ID: ' + $stateParams.contactId + '</small>';
                }]
            }
          }
        })
*/
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