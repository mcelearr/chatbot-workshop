/**
 * @name public.login
 * @param {object} Angular module with dependencies
 **/

(function() {

    angular
        .module('public')
        .controller('public.login.controller', LoginController)
        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider
                    .when('/', {
                        templateUrl: '/partials/public/auth/login.html',
                        controller: 'public.login.controller'
                    })
                    .when('/login', {
                        templateUrl: '/partials/public/auth/login.html',
                        controller: 'public.login.controller'
                    });
            }
        ]);

    /* @ngInject */
    function LoginController($scope, apiService, $window, authService, $timeout, notificationService) {

        $scope.user = {};
        $scope.login = login;

        /**
         * Submits the login form data and authServiceenicates users
         */
        function login(valid, user) {

            $scope.errors = null;

            if (valid) {
                apiService.post('login', null, user).then(function(data) {
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
