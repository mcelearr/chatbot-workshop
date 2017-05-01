/**
 * @name api service
 * @description API method requests
 * @param {object} Angular module with dependencies
 **/

(function(app) {

    var useMock = false;

    angular
        .module('common')
        .service('apiService', ApiService);

    /* @ngInject */
    function ApiService($q, $rootScope, $http, cfpLoadingBar) {

        var _this = this;

        var API_URL = '/api';

        /**
         * Transform shortform endpoint to full parameterised form
         * @param {String} endpoint short form of endpoint
         * @return {String} full parameterised endpoint || new Error
         */
        var getEndpoint = function(endpoint) {
            var resolvedEndpoint;

            // list possiable endpoints and return. If no match found, return false
            var services = {
                'login': '/auth/login',
                'logout': '/auth/logout',
                'register': '/auth/register',
                'message': '/web/message',
                'totals': '/analytics/totals/{from_date}/{to_date}',
                'channels': '/analytics/channels/{from_date}/{to_date}',
                'messages': '/analytics/messages/{from_date}/{to_date}',
                'messages_paged': '/analytics/messages/{from_date}/{to_date}/{count}/{page}',
                'messages_paged_sorted': '/analytics/messages/{from_date}/{to_date}/{count}/{page}/{sort}/{direction}',
                'unanswered_paged': '/analytics/messages/unanswered/{from_date}/{to_date}/{count}/{page}',
                'unanswered_paged_sorted': '/analytics/messages/unanswered/{from_date}/{to_date}/{count}/{page}/{sort}/{direction}',
                'flagged': '/analytics/messages/flagged/{from_date}/{to_date}/{count}/{page}',
                'flagged_paged_sorted': '/analytics/messages/flagged/{from_date}/{to_date}/{count}/{page}/{sort}/{direction}',
                'intent_percentage': '/analytics/intents/{from_date}/{to_date}',
                'intents': '/training/intents',
                'intent': '/training/intent/{id}',
                'conversations': '/analytics/conversations/{from_date}/{to_date}',
                'conversations_paged': '/analytics/conversations/{from_date}/{to_date}/{count}/{page}',
                'conversations_paged_sorted': '/analytics/conversations/{from_date}/{to_date}/{count}/{page}/{sort}/{direction}',
                'conversation': '/analytics/conversations/{id}/messages',
                'emotion': '/training/emotion/{id}',
                'settings': '/config'
            };

            // To be safe, allow users to use camelcase, - or _
            resolvedEndpoint = services[endpoint.toLowerCase()] || false;

            // If endpoint is incorrect, throw error
            if (!resolvedEndpoint) {
                throw new Error('Invalid API endpoint, Remember to add new endpoints to api.js getEndpoint function. Endpoint: ' + endpoint);
            }

            return resolvedEndpoint;
        };


        /**
         * Checks if sessionStorage is available on client
         * @return {Boolean}
         */
        var storageAvailable = function() {
            return (typeof(Storage) !== "undefined");
        };


        /**
         * Gets string value from a object property, using dot notation for child items.
         * @param {String} propertyname Property name
         * @param {Object} obj Object to check against
         * @return {String} property value
         */
        var getProperty = function(propertyName, obj) {
            var parts = propertyName.split("."),
                length = parts.length,
                i,
                property = obj || this;

            for (i = 0; i < length; i++) {
                property = property[parts[i]];
            }

            return property;
        };


        /**
         * Replace properties placed within {} with object values. Uses dot notation for child properties.
         * @param {String} endpoint parameterised endpint
         * @param {Object} data Object to check against
         * @return {String} property value || new Error
         */
        var formatEndpoint = function(endpoint, data) {
            var regex = /{(.*?)}/g,
                matches = endpoint.match(regex);


            if (!data) {
                // If no data is passed in, strip parametors from endpoint and return.
                endpoint = endpoint.replace(/{{.*?}}/g, '').replace(/\/\//g, '/');
                return endpoint;
            }

            if (matches && matches.length) {
                for (var i = 0, len = matches.length; i < len; i++) {
                    endpoint = endpoint.replace(new RegExp(matches[i], 'g'), getProperty(matches[i].replace(/{|}/g, ""), data));
                }
            }

            // if all replaceable strings ({prop}) have not been replaced, throw error and show array to help debugging.
            if (endpoint.indexOf('{') > -1) {
                throw new Error('You seem to be missing an expected property on this endpoint. Ensure you have the follow:', matches);
            }

            return endpoint;
        };


        /**
         * Extracts properties of a object that are not present in a parameterised string
         * @param {String} endpoint parameterised endpint
         * @param {Object} data Object to check against
         * @return {Object} object with unmatched properties
         */
        var extractParams = function(endpoint, data) {
            var params = {};

            for (var prop in data) {
                if (endpoint.indexOf(prop) === -1) {
                    params[prop] = data[prop];
                }
            }
            return params;
        };


        /**
         * Gets sessionStorage data from key
         * @param {String} key of item
         * @return {Object} Object of stored data
         */
        var getCachedData = function(key, local) {
            key = key.toLowerCase();
            var storage = local ? localStorage : sessionStorage;
            return JSON.parse(storage.getItem(key));
        };


        /**
         * Sets sessionStorage data from key
         * @param {String} key of item
         * @return void
         */
        var setCachedData = function(key, result, local) {
            key = key.toLowerCase();
            var storage = local ? localStorage : sessionStorage;
            storage.setItem(key, (result === Object(result)) ? JSON.stringify(result) : result);
        };


        this.getFormattedUrl = function(endpoint, data) {
            endpoint = getEndpoint(endpoint);
            var qstring = extractParams(endpoint, data);
            // Replace endpoint vars with data.
            endpoint = formatEndpoint(endpoint, data);
            return API_URL + endpoint;
        };


        this.upload = function(endpoint, data, local) {
            var deferred = $q.defer();
            endpoint = getEndpoint(endpoint);

            // Replace endpoint vars with data.
            endpoint = formatEndpoint(endpoint, data);

            var url = local ? endpoint : API_URL + endpoint;

            // Make call
            var serviceMethod = $http.post(url, data, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            });

            // Handle response
            serviceMethod.success(function(result, status, headers, config) {
                    if (status === 200) {
                        deferred.resolve(result);
                    } else {
                        deferred.reject(result);
                    }
                })
                .error(function(result, status, headers, config) {
                    deferred.reject(result);
                });

            return deferred.promise;
        };

        /**
         * GET http request
         * @param {String} endpoint short form of rquired endpoint
         * @param {Object} data object with request data, settings and parameters
         * @return {boolean} forceRefreah flag to force a refresh of cached data
         */
        this.getRequest = function(endpoint, data, cacheResults, local) {
            var deferred = $q.defer(),
                cachedKey = endpoint + JSON.stringify(data);

            //If session storage is available, check for cached data and return.
            if (cacheResults && storageAvailable()) {
                var cache = getCachedData(cachedKey, local);
                if (cache) {
                    deferred.resolve(cache);
                    return deferred.promise;
                }
            }

            // Get full endpoint
            endpoint = getEndpoint(endpoint);
            var qstring = extractParams(endpoint, data);

            // Replace endpoint vars with data.
            endpoint = formatEndpoint(endpoint, data);

            // Make call
            var serviceMethod = $http.get(API_URL + endpoint, {
                params: qstring
            });

            cfpLoadingBar.start();

            // Handle response
            serviceMethod.success(function(result, status, headers, config) {
                    cfpLoadingBar.complete();
                    if (status === 200) {

                        if (cacheResults && storageAvailable() && result) {
                            // If array, must be above one item.
                            setCachedData(cachedKey, result, local);
                        }
                        deferred.resolve(result);
                    }
                })
                .error(function(result, status, headers, config) {
                    cfpLoadingBar.complete();
                    deferred.reject(result);
                });

            return deferred.promise;
        };

        /**
         * POST http request
         * @param {String} endpoint short form of rquired endpoint
         * @param {Object} url params
         * @param {Object} data object with request data
         */
        this.postRequest = function(endpoint, urlParams, data, local) {
            var deferred = $q.defer();

            endpoint = getEndpoint(endpoint);

            // Replace endpoint vars with data.
            endpoint = formatEndpoint(endpoint, urlParams);

            var url = local ? endpoint : API_URL + endpoint;

            // Make call
            var serviceMethod = $http.post(url, data);

            cfpLoadingBar.start();

            // Handle response
            serviceMethod.success(function(result, status, headers, config) {
                    cfpLoadingBar.complete();
                    if (status === 200) {
                        deferred.resolve(result);
                    } else {
                        deferred.reject(result);
                    }
                })
                .error(function(result, status, headers, config) {
                    cfpLoadingBar.complete();
                    deferred.reject(result);
                });

            return deferred.promise;
        };


        /**
         * PUT http request
         * @param {String} endpoint short form of rquired endpoint
         * @param {Object} url params
         * @param {Object} data object with request data
         */
        this.putRequest = function(endpoint, urlParams, data) {
            var deferred = $q.defer();

            endpoint = getEndpoint(endpoint);

            // Replace endpoint vars with data.
            endpoint = formatEndpoint(endpoint, urlParams);

            // Make call
            var serviceMethod = $http.put(API_URL + endpoint, data);

            cfpLoadingBar.start();

            // Handle response
            serviceMethod.success(function(result, status, headers, config) {
                    cfpLoadingBar.complete();
                    if (status === 200) {
                        deferred.resolve(result);
                    }
                })
                .error(function(result, status, headers, config) {
                    cfpLoadingBar.complete();
                    deferred.reject(result);
                });

            return deferred.promise;
        };


        /**
         * DELETE http request
         * @param {String} endpoint short form of rquired endpoint
         */
        this.deleteRequest = function(endpoint, urlParams, data) {
            var deferred = $q.defer();

            endpoint = getEndpoint(endpoint);

            // Replace endpoint vars with data.
            endpoint = formatEndpoint(endpoint, urlParams);

            // Make call
            var serviceMethod = $http.delete(API_URL + endpoint);
            // Handle response

            cfpLoadingBar.start();

            serviceMethod.success(function(result, status, headers, config) {
                    cfpLoadingBar.complete();
                    if (status === 200) {
                        // If params include a before stamp, add paged property for ease
                        deferred.resolve(result);
                    }
                })
                .error(function(result, status, headers, config) {
                    cfpLoadingBar.complete();
                    deferred.reject(result);
                });

            return deferred.promise;
        };

        /**
         * MOCK GET http request
         * @param {String} endpoint short form of rquired endpoint
         * @param {Object} data object with request data, settings and parameters
         * @return {boolean} forceRefreah flag to force a refresh of cached data
         */
        this.mockGet = function(endpoint, data, cacheResults, local) {
            var deferred = $q.defer();
            var result;
            var mockKey = endpoint;

            // Get full endpoint
            endpoint = getEndpoint(endpoint);
            var qstring = extractParams(endpoint, data);

            // Replace endpoint vars with data.
            endpoint = formatEndpoint(endpoint, data);

            result = window.mocks[mockKey];


            if (cacheResults) {
                deferred.resolve(result);
            } else {
                cfpLoadingBar.start();
                console.log('GET:: ' + endpoint);
                setTimeout(function() {
                    cfpLoadingBar.complete();
                    deferred.resolve(result);
                }, 1000);
            }

            return deferred.promise;
        };


        /**
         * MOCK POST http request
         * @param {String} endpoint short form of rquired endpoint
         * @param {Object} data object with request data, settings and parameters
         * @return {boolean} forceRefreah flag to force a refresh of cached data
         */
        this.mockPost = function(endpoint, urlParams, data, local) {
            var deferred = $q.defer();
            var result = window.mocks[endpoint];


            endpoint = getEndpoint(endpoint);
            // Replace endpoint vars with data.
            endpoint = formatEndpoint(endpoint, urlParams);

            cfpLoadingBar.start();

            console.log('POST:: ' + endpoint);
            setTimeout(function() {
                cfpLoadingBar.complete();
                deferred.resolve(result);
            }, 1000);

            return deferred.promise;
        };


        /**
         * MOCK POST http request
         * @param {String} endpoint short form of rquired endpoint
         * @param {Object} data object with request data, settings and parameters
         * @return {boolean} forceRefreah flag to force a refresh of cached data
         */
        this.mockPut = function(endpoint, urlParams, data) {
            var deferred = $q.defer();
            var result = window.mocks[endpoint];

            endpoint = getEndpoint(endpoint);
            // Replace endpoint vars with data.
            endpoint = formatEndpoint(endpoint, urlParams);

            cfpLoadingBar.start();

            console.log('PUT:: ' + endpoint);

            setTimeout(function() {
                cfpLoadingBar.complete();
                deferred.resolve(result);
            }, 1000);

            return deferred.promise;
        };

        /**
         * MOCK DELTE http request
         * @param {String} endpoint short form of rquired endpoint
         * @param {Object} data object with request data, settings and parameters
         * @return {boolean} forceRefreah flag to force a refresh of cached data
         */
        this.mockDelete = function(endpoint, urlParams, data) {
            var deferred = $q.defer();
            var result = window.mocks[endpoint];

            endpoint = getEndpoint(endpoint);
            // Replace endpoint vars with data.
            endpoint = formatEndpoint(endpoint, urlParams);

            cfpLoadingBar.start();

            console.log('DELETE:: ' + endpoint);

            setTimeout(function() {
                cfpLoadingBar.complete();
                deferred.resolve(result);
            }, 1000);

            return deferred.promise;
        };


        this.get = useMock ? this.mockGet : this.getRequest;
        this.put = useMock ? this.mockPut : this.putRequest;
        this.post = useMock ? this.mockPost : this.postRequest;
        this.delete = useMock ? this.mockDelete : this.deleteRequest;
    }


}());
