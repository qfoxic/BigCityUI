angular.module('bigcity.common.users', [
    'ngResource'
])

    .service('UsersService', ['$resource', '$http', '$rootScope', 'API_SERVER', 'utils', '$q',
        function ($resource, $http, $rootScope, API_SERVER, utils, $q) {
            'use strict';
            var userUrl = API_SERVER + '/user/',
                loginUrl = API_SERVER + '/login/',
                logoutUrl = API_SERVER + '/logout/',
                usersUrl = API_SERVER + '/users/',
                updGroups = API_SERVER + '/user/:userId/updgroups/',
                chPasswd = API_SERVER + '/user/:userId/chpasswd/',
                cache = $rootScope.cache,
                User = {},
                res = $resource(
                    userUrl + ':userId/',
                    {userId: '@id'},
                    {
                        update: {method: 'PUT'},
                        updgroups: {method: 'POST', url: updGroups},
                        chpasswd: {method: 'POST', url: chPasswd}
                    }
                );

            User.login = function (userData) {
                var h = $http.post(loginUrl, userData);

                h.then(function (resp) {
                    var token = 'Token ' + resp.data.result.token;
                    cache.clearAll();
                    $rootScope.curUser = resp.data.result;
                    cache.set($rootScope.userCacheName, resp.data.result);
                    $http.defaults.headers.common.Authorization = token;
                });
                return h;
            };
            User.logout = function () {
                var h = $http.get(logoutUrl);

                h.then(function () {
                    cache.clearAll();
                    $http.defaults.headers.common.Authorization = null;
                    delete $rootScope.curUser;
                });
                return h;
            };
            User.create = function (userData) {
                var deferred = $q.defer();

                utils.resolveAddressToGeo(userData.address).then(function (loc) {
                    userData.country = loc.address.country;
                    userData.state = loc.address.state;
                    userData.street = loc.address.street;
                    userData.city = loc.address.city;
                    userData.lng = loc.lng;
                    userData.lat = loc.lat;
                    res.save(userData).$promise.then(function (resp) {
                        deferred.resolve(resp);
                    }).finally(function () {
                        deferred.reject([]);
                    });
                });
                return deferred.promise;
            };
            User.update = function (userData) {
                return res.update(userData).$promise;
            };
            User.current = function () {
                return cache.get($rootScope.userCacheName) || {};
            };
            User.get = function (uid) {
                return res.get({userId: uid}).$promise;
            };
            User.delete = function (uid) {
                return res.remove({userId: uid}).$promise;
            };
            User.list = function (params) {
                return $http.get(usersUrl, params);
            };
            User.updgroups = function (uid, gids) {
                return res.updgroups({id: uid, gids: gids}).$promise;
            };
            User.chpasswd = function (uid, password) {
                return res.chpasswd({id: uid, password: password}).$promise;
            };

            return User;
        }]);
