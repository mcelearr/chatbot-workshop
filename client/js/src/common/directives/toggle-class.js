/**
 * @name directives.toggle.class
 * @description toggles class on self when clicked
 * @param {object} Angular module with dependencies
 **/

(function(app) {

    app.directive('toggleClass', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('click', function(e) {
                    e.stopPropagation();
                    if (element.hasClass(attrs.toggleClass) && attrs.removeSelf) {
                        element.removeClass(attrs.toggleClass);
                    } else {

                        if (!element.hasClass('active')) {
                            element.parent().parent().find('a').removeClass(attrs.toggleClass);
                            element.toggleClass(attrs.toggleClass);
                        }
                    }
                });
            }
        };
    });

}(angular.module("common")));
