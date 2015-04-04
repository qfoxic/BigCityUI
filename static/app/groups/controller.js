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
          controller: ['$scope', '$state', 'GroupsService', 'notify', 'modal',
            function ($scope, $state, GroupsService, notify, modal) {
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
                      notify.success('Group was saved!');
                  },
                  function(err) {
                      notify.error(err.data.error);
                  });
              };
              $scope.create = function(form) {
                var edited = {};
                angular.forEach(form, function(prop, key) {
                  if (!key.startsWith('$') && prop.$dirty) {
                    edited[key] = prop.$viewValue;
                  }
                });
                GroupsService.create(edited).then(
                  function(data) {
                      $state.go('groups.list');
                      notify.success('Group was created!');
                  },
                  function(err) {
                      notify.error(err.data.error);
                  });
              };
              $scope.delete = function(group, index) {
                modal.warning(
                    'Warning!',
                    'Are sure you want to remove a group ' + group.name,
                    function(){
                      GroupsService.delete(group.id).then(
                          function(data) {
                                $scope.groups.splice(index, 1);
                                notify.success('Group was deleted!');
                          },
                          function(err) {
                              notify.error(err.data.error);
                          });
                    }
                );
              };
            }]
        })
        .state('groups.list', {
          url: '/list',
          templateUrl: '/static/app/groups/list.html',
          controller: ['$scope', '$state', 'GroupsService',
            function ($scope, $state, GroupsService) {
              $scope.$parent.groups = {};
              $scope.loading = true;
              GroupsService.list({}).then(
                  function(data) {
                    $scope.$parent.groups = data.data.result;
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
                  );
                }]
            }
          }
        })
        .state('groups.create', {
          url: '/group/create',
          views: {
            '': {
              templateUrl: '/static/app/groups/create.html',
              controller: ['$scope', '$stateParams', 'GroupsService', 'notify',
                function ($scope, $stateParams, GroupsService, notify) {
                  $scope.group = {};
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
                  );
                }]
            }
          }
        });
    }
  ]
);
