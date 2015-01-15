(function (angular) {

    'use strict';

    angular.module( 'scentui.techadmin.importcsv.importing', [
        'ui.router',
        'templates-app',
        'LocalStorageModule',
        'scentui.techadmin.importcsv.steps'
    ])

    .config(function config($stateProvider) {

        $stateProvider.state('techadmin.importcsv.importing', {
            url         : '/importing',
            controller  : 'ImportCsvImportingCtrl',
            templateUrl : 'techadmin/importcsv/importing/importing.tpl.html',
            data        : { pageTitle: 'Importing CSV File' }
        });
    })

    .controller( 'ImportCsvImportingCtrl', function ImportCsvImportingCtrl($scope, $state, importTypes, importStepsService, localStorageService, _) {

        $scope.steps    = importStepsService.steps();
        $scope.timeLeft = '3 hours';

        _.each(importTypes, function (type) {

            var columnMap = localStorageService.get('columnMap.'   + type);

            if (columnMap){
                console.log('TODO: submit column mapping for ' + type, columnMap);
            }

            var corrections = localStorageService.get('corrections.'   + type);

            if (corrections){
                console.log('TODO: submit corrections for ' + type, corrections);
            }

            localStorageService.remove('columnMap.'   + type);
            localStorageService.remove('corrections.' + type);
        });

        importStepsService.reset();
    })

;})(window.angular);
