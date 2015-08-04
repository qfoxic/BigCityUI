angular.module('bigcity.common.messages', [])
    .service('messages', function ($rootScope) {
        'use strict';
        return {
            addMessage: function (text, type) {
                $rootScope.messages = [];
                $rootScope.messages.push({text: text, type: type});
            },
            removeMessage: function (message) {
                var index = $rootScope.indexOf(message);
                $rootScope.messages.splice(index, 1);
            },
            success: function (msg) {
                this.addMessage(msg, 'success');
            },
            error: function (msg) {
                this.addMessage(msg, 'danger');
            },
            warning: function (msg) {
                this.addMessage(msg, 'warning');
            },
            info: function (msg) {
                this.addMessage(msg, 'info');
            }
        };
    });
