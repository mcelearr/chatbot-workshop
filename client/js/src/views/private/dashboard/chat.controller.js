/*  eslint-env angular*/

(function init() {
    angular
        .module('private')
        .controller('private.dashboard.chat.controller', LandingController)
        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider
                    .when('/', {
                        templateUrl: '/partials/private/dashboard/chat.html',
                        controller: 'private.dashboard.chat.controller'
                    })
                    .when('/console', {
                        templateUrl: '/partials/private/dashboard/chat.html',
                        controller: 'private.dashboard.chat.controller'
                    });
            }
        ]);

    /* @ngInject */
    function LandingController() {}
}());
