/**
 * @name directives.avatar
 **/

(function() {

    angular
        .module('common')
        .directive('cardList', DirectiveConfig)
        .controller('directives.card-list.controller', DirectiveController);

    /* @ngInject */
    function DirectiveController($scope, $element, $rootScope, $window, $location, eventService) {


        /*
        Bindable variables
         */

        $scope.perPage = 15;
        $scope.showLoader = true;
        $scope.sortBy = $scope.title;
        $scope.listData = [];
        $scope.gotoLocation = gotoLocation;
        $scope.openMenu = openMenu;



        /*
        Private functions
         */

        function gotoLocation(link, item, $event, isNew, isEdit) {
            var create, edit, currentPath = $location.path();

            $event.stopPropagation();

            if (isNew) {
                create = (currentPath == '/') ? 'create' : '/create';
                edit = (currentPath == '/') ? 'create' : '/create';
                $location.path(currentPath + (isNew ? create : edit));
            } else {

                link = link + (item.id ? ('/' + item.id) : '');

                if (link.indexOf('#/') > -1) {
                    $location.path(link.replace('#', ''));
                } else {
                    if (currentPath == '/') {
                        eventService.send('send-application-title', item);
                        $location.path(link);
                    } else {
                        $location.path(currentPath + link);
                    }
                }
            }

        }

        if ($window.innerHeight > 800) {
            $scope.perPage = 14;
        }

        if ($window.innerHeight > 900) {
            $scope.perPage = 14;
        }

        function openMenu(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        var init = function() {
            $scope.showLoader = false;
        };

        var unwatch = $scope.$watch('cardData', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.cardData = newVal;
                init();

                // remove the watcher
                //unwatch();
            }
        });

    }

    function DirectiveConfig() {
        return {
            restrict: 'E',
            scope: {
                cardData: '=ngModel',
                title: '@title',
                description: '@description',
                link: '@link',
                name: '@name',
                created: '@created'
            },
            templateUrl: '/partials/private/directives/card-list.html',
            controller: 'directives.card-list.controller'
        };
    }

}());
