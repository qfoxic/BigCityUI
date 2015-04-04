angular.module('bigcity.common.modal', [])
.service('modal', function ($rootScope) {
    return {
        modal: function(title, body, onSuccess, type) {
          /* type: error|success|warning. */
          $rootScope.modal_type = type;
          $rootScope.modal_title = title;
          $rootScope.modal_body = body;
          $rootScope.modal_onsuccess = onSuccess;
        },
        success: function(title, body, onSuccess) {
          this.modal(title, body, onSuccess, 'success');
        },
        error: function(title, body, onSuccess) {
          this.modal(title, body, onSuccess, 'danger');
        },
        warning: function(title, body, onSuccess) {
          this.modal(title, body, onSuccess, 'warning');
        },
        info: function(title, body, onSuccess) {
          this.modal(title, body, onSuccess, 'info');
        }
   };
});
