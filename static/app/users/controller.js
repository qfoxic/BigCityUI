angular.module('bigcity.users', [
  'ui.router',
])

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
