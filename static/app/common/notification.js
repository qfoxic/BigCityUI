angular.module('bigcity.common.notification', [])
.service('notify', function ($rootScope) {
    return {
        message: function(msg, type) {
          /* type: error|success|warning. */
          $rootScope.notify_msg = msg;
          $rootScope.notify_type = type;
        },
        success: function(msg) {
          this.message(msg, 'success');
        },
        error: function(msg) {
          this.message(msg, 'danger');
        },
        warning: function(msg) {
          this.message(msg, 'warning');
        },
        info: function(msg) {
          this.message(msg, 'info');
        }
   };
})
