/**
 * @name directives.animator
 * @description Animate.css triggers on scroll
 **/

(function() {

    angular
        .module('common')
        .directive('animator', animatorController);

    /* @ngInject */
    function animatorController($window) {
        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            template: '<div ng-transclude ng-show=\'show\'></div>',
            scope: {
                show: '@',
            },
            link: function($scope, $element, $attrs) {

                // Calculate if element is in viewport
                function elementInViewport(elem) {
                    el = elem[0];
                    var rect = el.getBoundingClientRect();

                    return rect.bottom > 0 &&
                        rect.right > 0 &&
                        rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
                        rect.top < (window.innerHeight || document.documentElement.clientHeight);
                }

                // bind to window scroll.
                angular.element($window).bind('scroll', function() {
                    if (elementInViewport($element) && !$scope.show) {
                        $scope.show = true;
                    }

                    $scope.$apply();
                });
            }
        };

    }

}());
