/**
 * @name services.event
 **/

(function() {

    angular
        .module('common')
        .service('eventService', EventService);

    /* @ngInject */
    function EventService($rootScope, $timeout) {

        this.send = function(msg, data) {
            $timeout(function() {
                data = data || {};
                $rootScope.$emit(msg, data);
            });
        };

        this.on = function(msg, func, scope) {
            var unbind = $rootScope.$on(msg, func);
            if (scope) {
                scope.$on('$destroy', unbind);
            }
        };
    }


}());
