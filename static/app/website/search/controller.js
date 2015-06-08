angular.module('bigcity.website.search', [
  'ui.router',
])

.config(
  ['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('search', {
            url: '/search',
            abstract: true,
            resolve: {
                categories: function(NodesService) {
                    return NodesService.categories();
                }
            },
            templateUrl: '/static/app/website/search/main.html',
            controller: ['$scope', 'categories', function($scope, categories) {
                $scope.data = categories;
            }]
        })
        .state('search.all', {
            url: '/all',
            views: {
                'category': {
                    templateUrl: '/static/app/website/search/all.html',
                    controller: ['$scope', '$stateParams',
                        function($scope, $stateParams) {
                            $scope.categories = $scope.data[0];
                        }
                    ]
                }
            }
        })
        .state('search.category', {
            url: '/:categoryId',
            views: {
                'category': {
                    templateUrl: '/static/app/website/search/category.html',
                    controller: ['$scope', '$stateParams',
                        function($scope, $stateParams) {
                            var catDict = $scope.data[3],
                                curCat = catDict[$stateParams.categoryId],
                                childNodes = $scope.data[1],
                                parentNodeId = curCat.parent ? curCat.parent : curCat.id

                            $scope.categories = $scope.data[2];
                            $scope.current = curCat;
                            $scope.parent = catDict[parentNodeId];
                            $scope.children = angular.element.grep(childNodes, function(n) {
                                return n.parent === parentNodeId});
                        }
                    ]
                }
            }
        })
    }
  ]
);
