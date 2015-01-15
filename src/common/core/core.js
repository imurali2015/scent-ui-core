(function ScentCore (angular, _, d3) {

    'use strict';

    angular.module('scent.core', ['ngResource'])
           .config(function config($httpProvider) {
                $httpProvider.defaults.withCredentials = false;
                    // this needs to be changed to true when auth is running
                    //  (TODO: when we figure out how auth will work for real, fix this)
           })
           .constant('_',  _)
           .constant('d3', d3)
           .constant('authCode', '17babf54e3218e8dfaf97346275be13')
           .constant('baseUrl',  'http://localhost:3000')               // local mock server driven by api-blueprint.md

           // .constant('baseUrl',  'http://private-9972-psi1proto.apiary-mock.com')                         // apiary.io server
           // .constant('baseUrl',  '/svc-web');                                                             // same origin
           // .constant('baseUrl',  'http://scent.ed-group.scholastic-labs.io:8080/svc-web');                // jboss
           // .constant('baseUrl',  'http://scent.ed-group.scholastic-labs.io:8280/ed-service-role/1.0.0');  // wso2

           .filter('keys', function() {
                return function(obj) {
                    return _.chain(obj)
                            .map(function (value, key) { return value != null ? key : undefined; })
                            .filter(function(v) { return v != null; })
                            .value();
                };
            })
           .filter('countkeys', function(keysFilter) {
                return function(obj) { return keysFilter(obj).length; };
            })
           .filter('capitalize', function() {
                return function(string) {
                    return angular.isString(string) ? string.charAt(0).toUpperCase() + string.slice(1) : '';
                };
            })
           ;




})(window.angular, window._, window.d3);
