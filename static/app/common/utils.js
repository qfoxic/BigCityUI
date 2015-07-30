angular.module('bigcity.common.utils', [])
    .service('utils', ['$http', '$q', function ($http, $q) {
        'use strict';
        return {
            groupByArray: function (arr, byField) {
                var grouped = {};
                angular.forEach(arr, function (val) {
                    var groupField = this[val[byField]];
                    if (!groupField) {
                        groupField = [];
                    }
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
                    deferred = $q.defer(),
                    auth = $http.defaults.headers.common.Authorization;

                // Delete Authorization header to avoid CORS.
                delete $http.defaults.headers.common.Authorization;
                if (address) {
                    $http.get(mapsUrl).success(function (data) {
                            var location = data.results[0].geometry.location,
                                address = data.results[0].formatted_address.split(',')
                            deferred.resolve({
                                lat: location.lat,
                                lng: location.lng,
                                address: {
                                    country: address[address.length - 1],
                                    state: address[address.length - 2],
                                    city: address[address.length - 3],
                                    street: address[0]
                                }
                            });
                        }).error(function () {
                            deferred.resolve({lat: 0.0, lng: 0.0, address: {}});
                        });
                } else {
                    $http.get(ipUrl).success(function (data) {
                        var location = data.loc.split(',');
                        deferred.resolve({lat: location[0], lng: location[1], address: {}});
                    }).error(function () {
                        deferred.resolve({lat: 0.0, lng: 0.0, address: {}});
                    });
                }
                $http.defaults.headers.common.Authorization = auth;
                return deferred.promise;
            }
        };
    }]);
