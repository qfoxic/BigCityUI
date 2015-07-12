angular.module('bigcity.website.advert', [
    'ui.router'
]).config(['$stateProvider', function ($stateProvider) {
    'use strict';
    $stateProvider
        .state('advert', {
            url: '/advert',
            abstract: true,
            templateUrl: '/static/app/website/advert/main.html'
        })
        .state('advert.create', {
            url: '/create',
            resolve: {
                categories: function (NodesService) {
                    return NodesService.categories();
                }
            },
            views: {
                'preview': {
                    templateUrl: '/static/app/website/advert/create.html',
                    controller: ['$scope', 'categories', function ($scope, categories) {
                        $scope.grouped = categories ? categories[2] : [];
                    }]
                },
                'aside': {
                    templateUrl: '/static/app/website/advert/create.aside.html'
                }
            }
        })
        .state('advert.preview', {
            url: '/:advertId',
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
