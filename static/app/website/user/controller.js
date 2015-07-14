angular.module('bigcity.website.user', [
    'ui.router'
]).config(['$stateProvider', function ($stateProvider) {
    'use strict';
    $stateProvider
        .state('user', {
            url: '/user',
            abstract: true
        })
        .state('user.create', {
            url: '/create',
            views: {
                'preview': {
                    templateUrl: '/static/app/website/user/create.html',
                    controller: ['$scope', 'NodesService',
                        function ($scope, NodesService) {

                        }]
                },
                'aside': {
                    templateUrl: '/static/app/website/user/aside.html'
                }
            }
        })
        .state('user.preview', {
            url: '/:userId',
            resolve: {
                advert: function ($stateParams, NodesService) {
                    return NodesService.get($stateParams.advertId, 'advert');
                }
            },
            views: {
                'header': {
                    templateUrl: '/static/app/website/advert/header.html',
                    controller: ['$scope', 'advert', function ($scope, advert) {
                        $scope.advert = advert.result;
                    }]
                },
                'preview': {
                    templateUrl: '/static/app/website/advert/preview.html',
                    controller: ['$scope', '$sce', 'advert', function ($scope, $sce, advert) {
                        advert.result.text = $sce.trustAsHtml(advert.result.text);
                        $scope.advert = advert.result;
                    }]
                },
                'aside': {
                    templateUrl: '/static/app/website/advert/aside.html',
                    controller: ['$scope', 'advert', function ($scope, advert) {
                        $scope.advert = advert.result;
                    }]
                }
            }
        });
}]);
