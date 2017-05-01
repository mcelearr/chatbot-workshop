/**
 * @name directives.headerbar.public
 **/

(function(app) {

    app.controller('directives.headerbar.public.controller', ['$scope', '$element', '$rootScope', '$location', '$window',
        function($scope, $element, $rootScope, $location, $window) {

            $scope.menuOpen = false;

            var menuIsDown = false;

            if ($scope.slideDown) {

                angular.element($window).bind('scroll', function() {
                    if ($window.scrollY > 200 && !menuIsDown) {
                        $element.addClass('affix');
                        menuIsDown = true;
                    } else if (menuIsDown && $window.scrollY <= 10) {
                        menuIsDown = false;
                        $element.removeClass('affix');
                    }
                });
            }

                        $scope.brand = false;

            if ($location.path().indexOf('software') > -1) {
                $scope.brand = 'Software One';
            }

            if ($location.path().indexOf('filament') > -1) {
                $scope.brand = 'filament';
            }


            $scope.getClass = function(path) {
                return ($location.path().substr(0, path.length) === path) ? 'active' : '';
            };

        }
    ]);

    app.directive('headerBarPublic', function() {
        return {
            restrict: 'E',
            scope: {
                slideDown: "@slideDown",
            },
            templateUrl: '/partials/chrome/header-bar-public.html',
            controller: 'directives.headerbar.public.controller'
        };
    });


}(angular.module("common")));
