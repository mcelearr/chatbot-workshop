/**
 * @name Match
 * @description Add input field validation for matching with another field
 * @param {object} Angular module with dependencies
 **/

(function(app) {

    app.directive('match', ['$parse',
        function($parse) {
            return {
                require: "ngModel",
                link: function(scope, elem, attrs, ctrl) {
                    var otherInput = elem.inheritedData("$formController")[attrs.match];

                    ctrl.$parsers.push(function(value) {
                        if (value === otherInput.$viewValue) {
                            ctrl.$setValidity("match", true);
                            return value;
                        }
                        ctrl.$setValidity("match", false);
                    });

                    otherInput.$parsers.push(function(value) {
                        ctrl.$setValidity("match", value === ctrl.$viewValue);
                        return value;
                    });
                }
            };
        }
    ]);

}(angular.module("common")));
