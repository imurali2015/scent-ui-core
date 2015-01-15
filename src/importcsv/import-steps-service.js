(function (angular, undefined) {

    'use strict';

    angular.module('scentui.techadmin.importcsv.steps', [
        'LocalStorageModule',
        'scent.core',
        'ui.router'
    ])

    .constant('importTypes', ['students', 'teachers', 'classes'])


    /**
     * @ngdoc service
     * @name scentui.techadmin.importcsv.steps.importStepsService
     * @description
     * # importStepsService
     *
     * Factory in the scentui.techadmin.importcsv.steps.
     */
    .factory('importStepsService', function(importTypes, _, localStorageService, $stateParams) {

        var steps = [];

        function parseProcesses (importProcesses) {
            return  _.chain(importTypes)
                     .filter(function (type) { return importProcesses[type]; })
                     .map(function (type) {
                         return {
                             importType : type,
                             processId  : importProcesses[type]
                         };
                     })
                     .value();
        }

        var service = {
            setProcesses: function (importProcesses) {
                var procs = importProcesses || localStorageService.get('importProcesses');

                if (!procs) {
                    // if there's no import processes either passed in or already in local storage,
                    //  try to get it from the state (url) parameters

                    procs = {};
                    procs[$stateParams.importType] = $stateParams.processId;
                }

                steps = parseProcesses(procs);

                if (importProcesses) {
                    localStorageService.set('importProcesses', importProcesses);
                }
            },
            steps: function () { return steps; },
            index: function (type) {
                return _.findIndex(steps, function (step) { return step.importType === type;});
            },
            step: function (type) {

                var i = this.index(type);

                return i >= 0 ? steps[i] : undefined;
            },
            first: function () {
                return steps[0];
            },
            next: function (type) {

                var i = this.index(type);

                return steps[++i];
            },
            reset: function () {
                steps = [];
                localStorageService.remove('importProcesses');
            }
        };

        return _.bindAll(service);
    })
    ;

})(window.angular);
