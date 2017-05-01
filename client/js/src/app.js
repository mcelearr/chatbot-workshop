angular.module('public', [
    'common',
    'ngRoute',
    'ngTemplates',
    'pascalprecht.translate',
    'app.i18n',
    'ngNotify',
    'cfp.loadingBar',
    'ngAnimate'
]).config(['$translateProvider',
    function($translateProvider) {
        $translateProvider.useSanitizeValueStrategy(null).useStaticFilesLoader({
            prefix: '',
            suffix: '.json'
        }).useLoaderCache('$translationCache').preferredLanguage('en');

    }
]).config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.html5Mode(true);
    }
]).config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
        $httpProvider.interceptors.push('httpInterceptorPublic');
    }
]).run(function($rootScope){
	$rootScope.appName = 'Framework';
});

angular.module('private', [
    'common',
    'ngRoute',
    'ngTemplates',
    'ngTable',
    'chart.js',
    'ngTagsInput',
    'cfp.loadingBar',
    'ngNotify',
    'angularPromiseButtons',
    'angularModalService',
    'pascalprecht.translate',
    'ngPrettyJson',
    'color.picker',
    'app.i18n',
    '720kb.datepicker',
    'angularMoment',
    'ngAnimate',
    'angularUtils.directives.dirPagination',
    'ngSanitize',
    'ngCsv'
]).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .otherwise({
                redirectTo: '/404'
            });
    }
]).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}]).config(['$translateProvider',
    function($translateProvider) {
        $translateProvider.useSanitizeValueStrategy(null).useStaticFilesLoader({
            prefix: '',
            suffix: '.json'
        }).useLoaderCache('$translationCache').preferredLanguage('en');

    }
]).config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
        $httpProvider.interceptors.push('httpInterceptorPrivate');
    }
]).config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }
]).run(function($rootScope){
	$rootScope.appName = 'Framework';
});

angular.module('common', []);
