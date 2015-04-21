angular.module('bigcity.nodes', [
  'ui.router',
])

.config(
  ['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('nodes', {
          abstract: true,
          url: '/nodes',
          templateUrl: '/static/app/nodes/main.html',
          controller: ['$scope', '$state', 'notify', 'modal', 'NodesService',
            function ($scope, $state, notify, modal, NodesService) {
              $scope.update = function(user, form) {
              };
              $scope.create = function(form) {
              };
              $scope.delete = function(user, index) {
              };
              $scope.list = function(page) {
                if (page < 1 || page > $scope.pages) {
                  return;
                }
                $scope.page = page;
                $scope.nodes = {};
                $scope.loading = true;
                NodesService.list({page: page}).then(
                    function(data) {
                      $scope.nodes = data;
                      $scope.pages = Math.ceil(data.count/50);
                      $scope.loading = false;
                    },
                    function(error){
                      $scope.loading = false;
                    });
              };
            }]
        })
        .state('nodes.list', {
          url: '/list',
          templateUrl: '/static/app/nodes/list.html',
          controller: ['$scope', '$state',
            function ($scope, $state) {
              $scope.list(1);
           }]
        })
        .state('nodes.create', {
          url: '/create',
          views: {
            '': {
              templateUrl: '/static/app/users/create.html',
              controller: ['$scope', '$stateParams', 'UsersService', 'notify',
                function ($scope, $stateParams, UsersService, notify) {
                  $scope.user = {};
                }]
            }
          }
        })
        .state('nodes.profile', {
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
        .state('nodes.update', {
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
        .state('nodes.detail', {
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
