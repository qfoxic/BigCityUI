angular.module('bigcity.groups', [
  'ui.router',
])

.config(
  ['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('groups', {
          abstract: true,
          url: '/groups',
          templateUrl: '/static/app/groups/main.html',
          controller: ['$scope', '$state', 'GroupsService', 'notify',
            function ($scope, $state, GroupsService, notify) {
              $scope.update = function(group, form) {
                var edited = {id: group.id};
                angular.forEach(form, function(prop, key) {
                  if (!key.startsWith('$') && prop.$dirty) {
                    edited[key] = prop.$viewValue;
                  }
                });
                GroupsService.update(edited).then(
                  function(data) {
                      $scope.group = data.result;
                      notify.success('User was saved!');
                  },
                  function(err) {
                      notify.error(err.data.error);
                  });
              };
            }]
        })
        .state('groups.list', {
          url: '/list',
          templateUrl: '/static/app/groups/list.html',
          controller: ['$scope', '$state', 'GroupsService',
            function ($scope, $state, GroupsService) {
              $scope.groups = {};
              $scope.loading = true;
              GroupsService.list({}).then(
                  function(data) {
                    $scope.groups = data.data.results;
                    $scope.loading = false;
                  });
           }]
        })
        .state('groups.update', {
          url: '/group/:groupId/update',
          views: {
            '': {
              templateUrl: '/static/app/groups/edit.html',
              controller: ['$scope', '$stateParams', 'GroupsService', 'notify',
                function ($scope, $stateParams, GroupsService, notify) {
                  $scope.group = {};
                  GroupsService.get($stateParams.groupId).then(
                    function(data) {
                      $scope.group = data.result;
                    },
                    function(err) {
                      notify.error(err.data.error, 'error');
                    }
                  )
                }]
            }
          }
        })
        .state('groups.detail', {
          url: '/groups/:groupId',
          views: {
            '': {
              templateUrl: '/static/app/groups/data.html',
              controller: ['$scope', '$stateParams', 'GroupsService', 'notify',
                function ($scope, $stateParams, GroupsService, notify) {
                  $scope.group = {};
                  GroupsService.get($stateParams.groupId).then(
                    function(data) {
                      $scope.group = data.result;
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
