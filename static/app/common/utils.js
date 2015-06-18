angular.module('bigcity.common.utils', [])
    .service('utils', ['$http', '$q', function ($http, $q) {
        'use strict';
        return {
            groupByArray: function (arr, byField) {
                var grouped = {};
                angular.forEach(arr, function (val) {
                    var groupField = this[val[byField]];
                    if (!groupField) {groupField = []; }
                    groupField.push(val);
                    this[val[byField]] = groupField;
                }, grouped);
                return grouped;
            },
            flattenTree: function (parentArr, childArr) {
                var arr = [],
                    dict = {},
                    grouped = this.groupByArray(childArr, 'parent');
                angular.forEach(parentArr, function (val) {
                    arr.push(val);
                    dict[val.id] = val;
                    angular.forEach(grouped[val.id], function (val) {
                        arr.push(val);
                        dict[val.id] = val;
                    });
                }, arr);
                return {flattenArr: arr, flattenDict: dict};
            },
            resolveAddressToGeo: function (address) {
                // Try to resolve by ip if prev failed or address wasn't specified.
                var mapsUrl = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + address,
                    ipUrl = 'http://ipinfo.io/json',
                    deferred = $q.defer();

                if (address) {
                    $http.get(mapsUrl).success(function (data) {
                        var location = data.results[0].geometry.location;
                        deferred.resolve(location);
                    }).error(function () {
                        deferred.resolve({lat: 0.0, lng: 0.0});
                    });
                } else {
                    $http.get(ipUrl).success(function (data) {
                        var location = data.loc.split(',');
                        deferred.resolve({lat: location[0], lng: location[1]});
                    }).error(function () {
                        deferred.resolve({lat: 0.0, lng: 0.0});
                    });
                }
                return deferred.promise;
            }
        };
    }]);
