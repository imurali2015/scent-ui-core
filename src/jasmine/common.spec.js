(function (angular, jasmine, undefined) {

    'use strict';

    function defineStandardMatchers (jasmine) {

        jasmine.addMatchers({
            toBeAnObject: function () {
                return angular.isObject(this.actual);
            },
            toBeAnArray: function () {
                return angular.isArray(this.actual);
            },
            toBeANumber: function () {
                return angular.isNumber(this.actual);
            },
            toBeAFunction: function () {
                return angular.isFunction(this.actual);
            },
            toBeAString: function () {
                //return typeof(this.actual === 'string');
                return angular.isString(this.actual);
            }
        });
    }


    angular.module('scent.test.common', []);

    /**
     * @ngdoc service
     * @name scent.test.common.scentTestService
     * @description
     * # scentTestService
     *
     * Factory that creates common facilities for specs.
     */
    angular
        .module('scent.test.common')
        .factory('scentTestService', function () {
            return {
                initCommon: function () {
                    defineStandardMatchers(this);
                }
            };
        });

})(window.angular, window.jasmine);
