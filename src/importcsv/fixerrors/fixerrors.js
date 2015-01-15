(function (angular, undefined) {

    'use strict';

    angular.module( 'scentui.techadmin.importcsv.fixerrors', [
        'ui.router',
        'templates-app',
        'LocalStorageModule',
        'scent.core',
        'scent.core.csv-errors',
        'scentui.techadmin.importcsv.steps'
    ])

    .config(function config( $stateProvider ) {

        $stateProvider.state( 'techadmin.importcsv.fixerrors', {
            url         : '/fixerrors/:importType/:processId',
            controller  : 'ImportCsvFixErrorsController',
            templateUrl : 'techadmin/importcsv/fixerrors/fixerrors.tpl.html',
            resolve     : {
                              // rows : function(csvRowsService, $stateParams) {
                              //    return csvRowsService.query({ processId : $stateParams.processId }).$promise;
                              // },
                              errors: function (csvErrorsService, $stateParams) {
                                 return csvErrorsService.query({ processId : $stateParams.processId }).$promise;
                              }
                          },
            data        : { pageTitle: 'Fix Errors' }
        });
    })

    .controller( 'ImportCsvFixErrorsController', function ImportCsvFixErrorsController($scope, $state, errors, _, importStepsService, localStorageService) {

        importStepsService.setProcesses();

        // console.log(importStepsService.steps());

        $scope.importType = $state.params.importType;
        $scope.processId  = $state.params.processId;
        $scope.rows       = errors.rows;
        $scope.steps      = importStepsService.steps();
        $scope.columns    = errors.columns;
        $scope.errors     = errors.errors;

        $scope.cellkey    = function (row, col) {
            return row + ',' + col;
        };

        $scope.errorMap   = _.reduce($scope.errors, function (acc, error) {
            var key   = $scope.cellkey(error.row, error.col);
            var value = errors.rows[error.row][error.col-1];

            error.value = value;
            acc[key] = error;

            // console.log (error);

            return acc;

        }, {});

        $scope.hasError = function (row, col) {
            return _.has($scope.errorMap, $scope.cellkey(row, col));
        };

        $scope.nextStep = function nextStep () {
            console.log('corrections: ', _.values($scope.errorMap));

            localStorageService.set('corrections.' + $state.params.importType, $scope.errorMap);

            var next = importStepsService.next($scope.importType);

            if (next)
            {
                $state.go('techadmin.importcsv.fixerrors', next);
            }
            else
            {
                $state.go('techadmin.importcsv.importing');
            }
        };
    })

;})(window.angular);
