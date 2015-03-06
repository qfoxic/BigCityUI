angular.module('bigcity.login', [
  'ui.router',
])

.config(
  ['$stateProvider', '$resourceProvider',
    function ($stateProvider, $resourceProvider) {
      $resourceProvider.defaults.stripTrailingSlashes = false;
      $stateProvider
        .state('login', {
          url: '/login',
          templateUrl: '/static/app/login/view.html',
          controller: ['$scope', 'UsersService',
            function ($scope, UsersService) {
              $scope.user = {};
              $scope.update = function(user) {
                  UsersService.login(user).then(
                    function(data) {
                    },
                    function(err) {
                        alert(err.data.error);
                    });
            };
          }]
        })
    }
  ]
);