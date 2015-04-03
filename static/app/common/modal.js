angular.module('bigcity.common.modal', [])
.service('modal', function ($rootScope) {
    return {
        modal: function(title, body, type) {
          /* type: error|success|warning. */
          $rootScope.modal_type = type;
          $rootScope.modal_title = title;
          $rootScope.modal_body = body;
        },
        successModal: function(title, body) {
          this.message(title, body, 'success');
        },
        errorModal: function(title, body) {
          this.message(title, body, 'danger');
        },
        warningModal: function(title, body) {
          this.message(title, body, 'warning');
        },
        infoModal: function(title, body) {
          this.message(title, body, 'info');
        }
   };
})
