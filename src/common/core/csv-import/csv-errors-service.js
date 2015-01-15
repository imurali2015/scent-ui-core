(function (angular, undefined) {

    'use strict';

    angular.module('scent.core.csv-errors', ['scent.core']);

    /**
     * @ngdoc service
     * @name scent.core.csv-errors.csvErrorsService
     * @description
     * # csvErrorsService
     *
     * Factory in the scent.core.csv-errors.
     */
    angular
        .module('scent.core.csv-errors')
        .factory('csvErrorsService', function($resource, baseUrl, authCode) {

                return $resource(
                    baseUrl + '/csvImports/:processId/errors',
                    {},
                    { query : { method  : 'GET',
                                headers : { 'Authorization' : 'Bearer ' + authCode } }
                    });
              });

})(window.angular);
