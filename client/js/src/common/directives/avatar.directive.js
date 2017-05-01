/**
 * @name directives.avatar
 **/

(function(app) {

    angular
        .module('common')
        .directive('avatar', avatarConfig)
        .controller('avatar.directive.controller', avatarController);

    /* @ngInject */
    function avatarController($scope, $element, authService) {


        var setInitials = function() {
            if ($scope.firstname) {
                $element.text($scope.firstname.charAt(0) + $scope.lastname.charAt(0));
            } else {
                $element.text('ME');
            }
        };

        setInitials();
    }

    function avatarConfig() {
        return {
            restrict: 'E',
            controller: 'avatar.directive.controller',
            scope: {
                firstname: '=',
                lastname: '=',
                userid: '='
            }
        };
    }

}());
