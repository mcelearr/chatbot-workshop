/**
 * @name httpInterceptor
 * @description httpInterceptor related functionality
 **/

(function() {

    angular
        .module('common')
        .factory('httpInterceptorCommon', commonFactory)
        .factory('httpInterceptorPrivate', privateFactory)
        .factory('httpInterceptorPublic', publicFactory);

    /* @ngInject */
    function commonFactory($q, $location, authService, $window) {

        return {
            requestError: function(request) {
                return $q.reject(request);
            },
            response: function(response) {
                return response || $q.when(response);
            },
            responseError: function(response) {

                if (response && response.status === 401) {
                    // authService.deAuthenticate();
                    // if ($location.path() != "/") {
                    //     $window.location.href = "/";
                    // }
                }
                return $q.reject(response);
            }
        };

    }

    /* @ngInject */
    function privateFactory($location, $rootScope, authService, $window, httpInterceptorCommon) {

        httpInterceptorCommon.request = function(config) {
            var authenticated = authService.isAuthenticated();

            if (!authenticated) {
                $window.location.href = '/login';
            }

            return config || $q.when(config);
        };

        return httpInterceptorCommon;

    }

    /* @ngInject */
    function publicFactory($location, authService, $window, httpInterceptorCommon) {

        httpInterceptorCommon.request = function(config) {
            var authenticated = authService.isAuthenticated();

            if (authenticated) {
                $window.location.href = '/portal#/';
            }

            return config || $q.when(config);
        };

        return httpInterceptorCommon;

    }


}());
