/**
 * @name services.event
 **/

(function() {

    angular
        .module('common')
        .service('notificationService', NotificationController);

    /* @ngInject */
    function NotificationController(ngNotify) {

        /**
         * show a notification message
         * @param {string} message to display
         * @param {string} type of message [success|danger|info]
         * @return {undefined}
         */
        this.set = function(msg, type) {
         	ngNotify.set(msg, type);
        };

        /**
         * show the default error message
         * @return {undefined}
         */
        this.defaultError = function() {
           ngNotify.set('Opps, something went wrong', 'error');
        };
    }


}());
