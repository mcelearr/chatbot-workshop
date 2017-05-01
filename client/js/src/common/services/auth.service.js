/**
 * @name auth
 * @description All login and register related functionlity
 * @param {object} Angular module with dependencies
 **/

(function() {

    angular
        .module('common')
        .service('authService', AuthService);

    /* @ngInject */
    function AuthService($rootScope, $window) {
        var context = this;

        /**
         * Check if the current user is authenticated
         * @return {bool} if user is logged in true or false
         */
        context.isAuthenticated = function() {
            return localStorage.getItem('isAuthenticated') ? JSON.parse(localStorage.getItem('isAuthenticated')) : false;
        };


        /**
         * Authenticate the current user
         * @return {undefined}
         */
        context.authenticate = function(user) {
            localStorage.setItem('isAuthenticated', true);
            localStorage.setItem('user', JSON.stringify(user));
        };


        /**
         * De authenticate the current user
         * @return {undefined}
         */
        context.deAuthenticate = function() {
            sessionStorage.clear();
            localStorage.clear();
            localStorage.setItem('isAuthenticated', false);
            localStorage.setItem('token', {});
            localStorage.setItem('user', {});
        };


        /**
         * Get the current user object
         * @return {object} current user object
         */
        context.getCurrentUser = function() {
            if (localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'));
            } else {
                //  $window.location.href = '/';
                return false;
            }
        };

    }

}());
