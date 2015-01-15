(function (angular) {

    'use strict';

    angular.module( 'scentui.techadmin.importcsv.upload', [
        'ui.router',
        'templates-app',
        'scentui.techadmin.importcsv.steps',
        'scent.core',
        'scent.uploadFile'
    ])

    .config(function config( $stateProvider ) {

        $stateProvider.state( 'techadmin.importcsv.upload', {
            url         : '/upload',
            controller  : 'ImportCsvUploadCtrl',
            templateUrl : 'techadmin/importcsv/upload/upload.tpl.html',
            data        : { pageTitle: 'Import Roster CSV' }
        });
    })

    .controller( 'ImportCsvUploadCtrl', function ImportCsvUploadCtrl($scope, $state, _, importTypes, importStepsService) {

        $scope.importTypes     = importTypes;
        $scope.importProcesses = {};

        importStepsService.reset();

        $scope.handleSuccess = function (importType, data) {
            console.log('successful import of type ' + importType);
            $scope.importProcesses[importType.toLowerCase()] = data.id;
                // n.b.: this limits us to one file per import type
        };

        $scope.nextStep = function () {

            // find which import types have been uploaded so far.
            // at some point we'll have to figure out where to keep the sequence of imports,
            // and how to navigate the sequence.

            importStepsService.setProcesses($scope.importProcesses);

            var firstStep = importStepsService.first();

            // go to the first one on the list for now

            $state.go('techadmin.importcsv.mapcolumns',
                      { importType      : firstStep.importType,
                        processId       : firstStep.processId
                      });
        };
    })

;})(window.angular);
