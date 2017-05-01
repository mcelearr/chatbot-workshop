/**
 * @name directives.progressbar
 * @param {object} Angular module with dependencies
 **/

(function(app) {

    app.controller('directives.progressbar.controller', ['$scope', '$element', '$rootScope',
        function($scope, $element, $rootScope) {

            $scope.progressValue = 0;
            $scope.class = 'success';

            var percentage = ($scope.used * 100) / $scope.total;

            if ($scope.reverse) {
                $scope.class = "danger";
            }


            if (percentage > 60) {
                $scope.class = 'warning';
            }

            if (percentage > 80) {
                $scope.class = $scope.reverse ? 'success' : 'danger';
            }

            $scope.progressValue = percentage;


        }
    ]);

    app.directive('progressBar', function() {
        return {
            restrict: 'E',
            templateUrl: '/partials/private/directives/progressbar.html',
            controller: 'directives.progressbar.controller',
            scope: {
                total: '@total',
                used: '@used',
                reverse: '@reverse'
            }
        };
    });

}(angular.module("common")));
