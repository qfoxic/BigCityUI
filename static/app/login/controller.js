angular.module('bigcity.login', [
  'ui.router',
  'ui.bootstrap',
])

.config(
  ['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('login', {
          url: '/login',
          templateUrl: '/static/app/login/main.html',
          controller: ['$scope', 'UsersService', '$state',
            function ($scope, UsersService, $state) {
              $scope.user = {};
              $scope.login = function(user) {
                  UsersService.login(user).then(
                    function(data) {
                      $state.go('home').then(function(data){
                        debugger
                        },
                        function(err) {
                          debugger
                        });
                    },
                    function(err) {
                        alert(err.data.error);
                    });
              };
          }]
        })
        .state('logout', {
          url: '/logout',
          controller: ['$scope', 'UsersService', '$rootScope', '$state',
            function ($scope, UsersService, $rootScope, $state) {
              $scope.user = {};
              $rootScope.logout = function() {
                UsersService.logout().then(
                  function(data) {
                    $state.go('login');
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