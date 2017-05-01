/**
 * @name private.redirect
 * @description 404 redirect page
 * @param {object} Angular module with dependencies
 **/

(function() {

    angular
        .module('private')
        .controller('private.404.controller', LoginController)
        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider
                    .when('/404', {
                        templateUrl: '/partials/404.html',
                        controller: 'private.404.controller'
                    });
            }
    ]);

    /* @ngInject */
    function LoginController($scope) {

    }


}());
