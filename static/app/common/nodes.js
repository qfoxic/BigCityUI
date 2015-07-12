angular.module('bigcity.common.nodes', ['ngResource'])
    .service('NodesService', ['$resource', '$q', 'utils',
        function ($resource, $q, utils) {
            'use strict';

            var nodeUrl = 'http://127.0.0.1:8001/node/',
                advertUrl = 'http://127.0.0.1:8001/advert/',
                nodesUrl = 'http://127.0.0.1:8001/nodes/:kind/',
                Node = {},
                res = $resource(nodeUrl + ':nid/',
                          {nid: '@id'},
                          {list: {method: 'GET', url: nodesUrl}}),
                resAdverts = $resource(advertUrl + ':nid/',
                          {nid: '@id'},
                          {list: {method: 'GET', url: nodesUrl}});

            Node.list = function (params) {
                return res.list(params).$promise;
            };
            Node.get = function (nid, kind) {
                if (kind === 'advert') {
                    return resAdverts.get({nid: nid}).$promise;
                }
                return res.get({nid: nid}).$promise;
            };
            Node.categories = function () {
                var pids = [], nodes = [], subnodes = [], merged = [], deferred = $q.defer();

                Node.list({page: 1, kind: 'category', where: 'parent is null'}).then(
                    function (data) {
                        nodes = data.results;
                        // Merge pids to a comma separated string.
                        angular.forEach(nodes,
                            function (val) {this.push('"' + val.id + '"'); }, pids);
                        Node.list({page: 1, kind: 'category', where: 'parent in (' + pids.join() + ')'}).then(
                            function (data) {
                                subnodes = data.results;
                                merged = utils.flattenTree(nodes, subnodes);
                                deferred.resolve([
                                    nodes,
                                    subnodes,
                                    merged.flattenArr,
                                    merged.flattenDict]);
                            },
                            function () {deferred.reject(); }
                        );
                    },
                    function () { deferred.reject(); }
                );

                return deferred.promise;
            };
            Node.nearest = function (params) {
                var deffered = $q.defer(),
                    priceTo = params.priceTo || '9999999999.0',
                    priceFrom = params.priceFrom || '0',
                    page = params.page || 1,
                    whereCond = (params.text ? 'text like "' + params.text + '" and ' : '') +
                                ('(price >= ' + priceFrom + ' and price <= ' +
                                 priceTo + ')'),
                    order = params.order;

                utils.resolveAddressToGeo(params.location).then(function (data) {
                    res.list({
                        kind: 'advert',
                        table: 'nearest',
                        tparams: 'parent=' + params.category + ',lat=' + data.lat + ',lon=' + data.lng,
                        where: whereCond,
                        page: page,
                        order: order
                    }).$promise.then(function (resp) {
                        deffered.resolve(resp);
                    }).finally(function () {
                        deffered.reject([]);
                    });
                });
                return deffered.promise;
            };
            return Node;
        }]);
