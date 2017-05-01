/**
 * @name directives.headerbar.private
 * @description Fixed top bar navigation
 * @param {object} Angular module with dependencies
 **/

(function(app) {

    app.controller('directives.headerbar.private.controller', ['$scope', '$element', '$window', '$location', 'apiService', 'authService', 'eventService', 'ngNotify',
        function($scope, $element, $window, $location, apiService, authService, eventService, ngNotify) {

            $scope.menuOpen = false;
            $scope.applicationOpen = false;
            $scope.showNav = false;

            $scope.user = authService.isAuthenticated();

            $scope.brand = false;

            if ($location.path().indexOf('software') > -1) {
                $scope.brand = 'software';
            }

            if ($location.path().indexOf('filament') > -1) {
                $scope.brand = 'filament';
            }

            $scope.getClass = function(path) {
                if (path == '/') {

                    return $location.path() === '/' ? 'active' : '';
                } else {

                    return ($location.path().indexOf(path) > -1) ? 'active' : '';
                }
            };

            $scope.logout = function() {
                authService.deAuthenticate();
                window.location = '/';

            };
        }
    ]);

    app.directive('headerBarPrivate', function() {
        return {
            restrict: 'E',
            templateUrl: '/partials/chrome/header-bar-private.html',
            controller: 'directives.headerbar.private.controller'
        };
    });


}(angular.module("common")));
