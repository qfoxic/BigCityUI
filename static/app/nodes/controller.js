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
              // TODO. Make this generic.
              $scope.list = function(page, kind, expr) {
                if (page < 1 || page > $scope.pages) {
                  return;
                }
                $scope.page = page;
                $scope.nodes = {};
                $scope.pages = 0;
                $scope.loading = true;
                NodesService.list({page: page, kind: kind, where: expr}).then(
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
              $scope.nodeTypes = ['category', 'advert'];
              $scope.curType = $scope.nodeTypes[0];
              $scope.expr = null;
              $scope.selectType = function(ntype) {
                  $scope.curType = ntype;
                  $scope.list(1, $scope.curType, $scope.expr);
              };
              $scope.list(1, $scope.curType, $scope.expr);
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
        .state('nodes.detail', {
          url: '/detail/:nid',
          views: {
            '': {
              templateUrl: '/static/app/nodes/data.html',
              controller: ['$scope', '$stateParams', 'NodesService', 'notify',
                function ($scope, $stateParams, NodesService, notify) {
                  $scope.node = {};
                  NodesService.get($stateParams.nid).then(
                    function(data) {
                      $scope.node = data.result;
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
