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
              templateUrl: '/static/app/home/main.html'
            }
          }
        })
    }
  ]
);
