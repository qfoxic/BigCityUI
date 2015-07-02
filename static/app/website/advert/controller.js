angular.module('bigcity.website.advert', [
    'ui.router'
]).config(['$stateProvider', function ($stateProvider) {
    'use strict';
    $stateProvider.state('home', {
        url: '/',
        templateUrl: '/static/app/website/advert/main.html',
        controller: ['$scope', 'NodesService', function ($scope, NodesService) {}]
    });
}]);
