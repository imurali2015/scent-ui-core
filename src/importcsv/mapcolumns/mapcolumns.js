(function (angular, undefined) {

    'use strict';

    angular.module( 'scentui.techadmin.importcsv.mapcolumns', [
        'ui.router',
        'templates-app',
        'LocalStorageModule',
        'scentui.techadmin.importcsv.steps',
        'scent.core',
        'scent.core.csv-column-map',
        'scent.core.csv-rows'
    ])

    .config(function config( $stateProvider ) {

        $stateProvider.state( 'techadmin.importcsv.mapcolumns', {
            url         : '/mapcolumns/:importType/:processId',
            controller  : 'ImportCsvMapColumnsCtrl',
            templateUrl : 'techadmin/importcsv/mapcolumns/mapcolumns.tpl.html',
            resolve     : {
                              columnMap: function (csvColumnMapService, $stateParams) {
                                  return csvColumnMapService.query({ processId : $stateParams.processId }).$promise;
                              },
                              rows : function(csvRowsService, $stateParams) {
                                  return csvRowsService.query({ processId : $stateParams.processId }).$promise;
                              }
                          },
            data        : { pageTitle: 'Map Columns' }
        });
    })

    .filter('countMapped', function($stateParams, csvExpectedColumns, _, keysFilter) {

        return function(mapping) {

            var required = _.pluck(csvExpectedColumns[$stateParams.importType].required, 'name');
            var filtered = _.intersection(required, keysFilter(mapping));

            // console.log('filter: ', filtered);

            return filtered.length;
        };
    })

    .filter('cellForColumn', function() {

        return function(row, systemColumn, columnMap) {

            var userColumn = columnMap.mapping[systemColumn],
                index      = userColumn ? columnMap.columns.indexOf(userColumn) : -1;

            return row[index];
        };
    })

    /*jshint -W072 */

    .controller( 'ImportCsvMapColumnsCtrl', function ImportCsvMapColumnsCtrl($scope, $state, countMappedFilter, columnMap, rows, importStepsService, csvExpectedColumns, _, localStorageService) {

        $scope.importType        = $state.params.importType;
        $scope.processId         = $state.params.processId;
        $scope.steps             = importStepsService.steps();
        $scope.requiredColumns   = csvExpectedColumns[$scope.importType].required;
        $scope.optionalColumns   = csvExpectedColumns[$scope.importType].optional;
        $scope.systemColumnNames = _.pluck($scope.requiredColumns.concat($scope.optionalColumns), 'name');

        $scope.rows              = rows.rows;
        $scope.columnMap         = columnMap;

        $scope.mappedCount       = countMappedFilter(columnMap.mapping);
        $scope.unmappedCount     = $scope.requiredColumns.length - $scope.mappedCount;

        $scope.nextStep = function nextStep () {
            // console.log('column mapping: ', $scope.columnMap.mapping);

            localStorageService.set('columnMap.' + $state.params.importType, columnMap.mapping);

            var next = importStepsService.next($scope.importType);

            if (next)
            {
                $state.go('techadmin.importcsv.mapcolumns', next);
            }
            else
            {
                $state.go('techadmin.importcsv.importing');
            }
        };
    })

;})(window.angular);
