angular.module('bigcity.home', [
  'ui.router',
])

.config(
  ['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('home', {
          url: '/',
          views: {
            '': {
              templateUrl: '/static/app/admin/home/main.html'
            }
          }
        })
    }
  ]
);
