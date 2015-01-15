(function (angular, undefined) {

    'use strict';

    angular.module('scent.core.csv-rows', ['scent.core']);

    /**
     * @ngdoc service
     * @name scent.core.csv-rows.csvRowsService
     * @description
     * # csvRowsService
     *
     * Factory in the scent.core.csv-rows.
     */
    angular
        .module('scent.core.csv-rows')
        .factory('csvRowsService', function($resource, baseUrl, authCode) {

                return $resource(
                    baseUrl + '/csvImports/:processId/rows',
                    {},
                    { query : { method  : 'GET',
                                headers : { 'Authorization' : 'Bearer ' + authCode } }
                    });
              });

})(window.angular);
