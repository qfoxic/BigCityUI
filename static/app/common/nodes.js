angular.module('bigcity.common.nodes', ['ngResource'])
    .service('NodesService', ['$resource', '$q', 'utils', 'FileUploader', '$rootScope', 'messages', 'API_SERVER',
        function ($resource, $q, utils, FileUploader, $rootScope, messages, API_SERVER) {
            'use strict';

            var nodeUrl = API_SERVER + '/node/',
                advertUrl = API_SERVER + '/advert/',
                messageUrl = API_SERVER + '/message/',
                categoryUrl = API_SERVER + '/category/',
                nodesUrl = API_SERVER + '/nodes/:kind/',
                imagesUrl = API_SERVER + '/images/:nid/',
                imageUrl = API_SERVER + '/image/',
                Node = {},
                res = $resource(nodeUrl + ':nid/',
                    {nid: '@id'},
                    {list: {method: 'GET', url: nodesUrl}}),
                resAdverts = $resource(advertUrl + ':nid/',
                    {nid: '@id'},
                    {
                        list: {method: 'GET', url: nodesUrl},
                        update: {method: 'PUT'}
                    }),
                resMessages = $resource(messageUrl + ':nid/',
                    {nid: '@id'},
                    {
                        list: {method: 'GET', url: nodesUrl},
                        update: {method: 'PUT'}
                    }),
                resCategory = $resource(categoryUrl + ':nid/',
                    {nid: '@id'},
                    {
                        list: {method: 'GET', url: nodesUrl},
                        update: {method: 'PUT'}
                    }),
                resImages = $resource(imageUrl + ':nid/',
                    {nid: '@id'},
                    {list: {method: 'GET', url: imagesUrl, isArray: true}});

            Node.list = function (params) {
                return res.list(params).$promise;
            };
            Node.get = function (nid, kind) {
                if (kind === 'advert') {
                    return resAdverts.get({nid: nid}).$promise;
                } else if (kind === 'message') {
                    return resMessages.get({nid: nid}).$promise;
                }
                return res.get({nid: nid}).$promise;
            };
            Node.images = function (params) {
                return resImages.list(params).$promise;
            };
            Node.removeImage = function (imageId) {
                return resImages.remove({nid: imageId}).$promise;
            };
            Node.uploader = function (advertData, queueLimit) {
                var uploader = new FileUploader({
                    url: imageUrl,
                    queueLimit: queueLimit || 5,
                    alias: 'content',
                    // Seems that will be useless after carrying to NodesService.
                    headers: {
                        Authorization: 'Token ' + $rootScope.curUser.token
                    },
                    formData: [
                        {'uid': advertData.uid},
                        {'perm': advertData.perm},
                        {'parent': advertData.id},
                        {'title': advertData.title},
                        {'asset_type': 'image'}
                    ]
                });
                uploader.onBeforeUploadItem = function (item) {
                    messages.info('Uploading file ' + item.file.name + '. Please wait ...');
                };
                uploader.onCompleteItem = function (item, response) {
                    if (response.error) {
                        messages.error('Could not upload file ' + item.file.name + '. ' + response.error);
                    } else {
                        messages.success('File ' + item.file.name + ' was uploaded.');
                    }
                };

                return uploader;
            };
            Node.create = function (data, kind) {
                if (kind === 'advert') {
                    var deferred = $q.defer();
                    utils.resolveAddressToGeo(data.location).then(function (loc) {
                        data.loc = [loc.lng, loc.lat];
                        data.country = loc.address.country;
                        data.region = loc.address.state;
                        data.city = loc.address.city;
                        data.street = loc.address.street;
                        resAdverts.save(data).$promise.then(function (resp) {
                            deferred.resolve(resp);
                        }).finally(function () {
                            deferred.reject([]);
                        });
                    });
                    return deferred.promise;
                } else if (kind === 'category') {
                    if (!data.parent) {
                        data.parent = undefined;
                    }
                    return resCategory.save(data).$promise;
                } else if (kind === 'message') {
                    var deferred = $q.defer(),
                        location = data.country + ',' + (data.region || '') + ',' + (data.city || '');
                    utils.resolveAddressToGeo(location).then(function (loc) {
                        data.country = loc.address.country;
                        data.region = loc.address.state;
                        data.city = loc.address.city;
                        resMessages.save(data).$promise.then(function (resp) {
                            deferred.resolve(resp);
                        }).finally(function () {
                            deferred.reject([]);
                        });
                    });
                    return deferred.promise;
                }
                return res.save(data).$promise;
            };
            Node.update = function (data, kind) {
                if (kind === 'advert') {
                    var deferred = $q.defer();
                    utils.resolveAddressToGeo(data.location).then(function (loc) {
                        data.loc = [loc.lng, loc.lat];
                        data.country = loc.address.country;
                        data.region = loc.address.state;
                        data.city = loc.address.city;
                        data.street = loc.address.street;
                        resAdverts.update(data).$promise.then(function (resp) {
                            deferred.resolve(resp);
                        }).finally(function () {
                            deferred.reject([]);
                        });
                    });
                    return deferred.promise;
                }
                return res.update(data).$promise;
            };
            Node.delete = function (data, kind) {
                if (kind === 'advert') {
                    return resAdverts.remove(data).$promise;
                } else if (kind === 'category') {
                    return resCategory.remove(data).$promise;
                } else if (kind === 'message') {
                    return resMessages.remove(data).$promise;
                }
                return res.remove(data).$promise;
            };
            Node.categories = function () {
                var pids = [], nodes = [], subnodes = [], merged = [], deferred = $q.defer();

                Node.list({page: 1, kind: 'category', where: 'parent is null'}).then(
                    function (data) {
                        nodes = data.results;
                        // Merge pids to a comma separated string.
                        angular.forEach(nodes,
                            function (val) {
                                this.push('"' + val.id + '"');
                            }, pids);
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
                            function () {
                                deferred.reject();
                            }
                        );
                    },
                    function () {
                        deferred.reject();
                    }
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
                        tparams: (params.category ? 'parent=' + params.category + ',' : '') + 'lat=' + data.lat + ',lon=' + data.lng,
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
