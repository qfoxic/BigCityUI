angular.module('bigcity.common.users', [
    'ngResource'
])

    .service('UsersService', ['$resource', '$http', '$rootScope',
        function ($resource, $http, $rootScope) {
            'use strict';
            var userUrl = 'http://api.bigcity.today/user/',
                loginUrl = 'http://api.bigcity.today/login/',
                logoutUrl = 'http://api.bigcity.today/logout/',
                usersUrl = 'http://api.bigcity.today/users/',
                updGroups = 'http://api.bigcity.today/user/:userId/updgroups/',
                chPasswd = 'http://api.bigcity.today/user/:userId/chpasswd/',
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
                return res.save(userData).$promise;
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
