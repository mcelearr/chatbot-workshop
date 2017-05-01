/**
 * @name public.register
 * @param {object} Angular module with dependencies
 **/

(function() {

    angular
        .module('public')
        .controller('public.register.controller', RegisterController)
        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider
                    .when('/register', {
                        templateUrl: '/partials/public/auth/register.html',
                        controller: 'public.register.controller'
                    });
            }
        ]);

    /* @ngInject */
    function RegisterController($scope, apiService, $window, authService, $timeout, notificationService) {

        $scope.user = {};
        $scope.register = register;

        /**
         * Submits the register form data
         */
        function register(valid, user) {

            $scope.errors = null;

            if (valid) {
                apiService.post('register', null, user).then(function(data) {
                    if (data) {
                        authService.authenticate(data);
                        $window.location = '/portal#/';
                    } else {
                        notificationService.set('Incorrect username or password', 'error');
                    }

                }, function(err) {
                    notificationService.set('Incorrect username or password', 'error');
                });
            }

        }
    }

}());
