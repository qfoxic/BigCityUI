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
        .state('advert.preview', {
            url: '/:advertId',
            resolve: {
                advert: function($stateParams, NodesService) {

                }
            },
            views: {
                'preview': {
                    templateUrl: '/static/app/website/advert/preview.html',
                    controller: ['$scope', 'advert', function ($scope, advert) {

                    }]
                },
                'aside': {
                    templateUrl: '/static/app/website/advert/aside.html',
                    controller: ['$scope', 'advert', function ($scope, advert) {

                    }]
                }
            }
        });
}]);
