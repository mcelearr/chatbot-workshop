/**
 * @name directives.dropdown
 **/

(function() {

    angular
        .module('common')
        .directive('dropdown', DropConfig);

    function DropConfig() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                // Toggle active class on current element.
                element.bind('click', function(e) {
                    element.toggleClass('active');
                });
            }
        };
    }

}());
