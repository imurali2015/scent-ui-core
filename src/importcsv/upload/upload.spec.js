describe('techadmin.importcsv.upload:', function () {

    'use strict';

    beforeEach(module('scent.test.common'));

    describe('ImportCsvUploadCtrl', function() {

        beforeEach(module('scentui.techadmin.importcsv.upload'));

        var ImportCsvUploadCtrl,
            $scope,
            $state,
            nextState,
            nextStateParams;

        beforeEach( inject( function( $controller, $rootScope ) {
            $scope = $rootScope.$new();
            $state = {
                current : { data: { pageTitle: 'Import Roster CSV' }},
                go      : function (state, params) {
                    nextState       = state;
                    nextStateParams = params;
                }};

            ImportCsvUploadCtrl = $controller( 'ImportCsvUploadCtrl', {
                $scope      : $scope,
                $state      : $state,
                importTypes : ['students', 'teachers', 'classes']
            });
        }));


        beforeEach(inject(function(scentTestService) {
            scentTestService.initCommon.call(this);
        }));


        it( 'should exist', inject(function() {
            expect(ImportCsvUploadCtrl).toBeTruthy();
        }));

        it('should contain a list of import types', inject(function() {
            expect($scope.importTypes).toBeDefined();
            expect($scope.importTypes).toBeAnArray();
            expect($scope.importTypes).toContain('students');
        }));

        it('should contain an empty map of import processes', inject(function() {
            expect($scope.importProcesses).toBeDefined();
            expect($scope.importProcesses).toBeAnObject();
            expect($scope.importProcesses).toEqual({});
        }));

        it('should contain a callback to handle successful upload', inject(function() {
            expect($scope.handleSuccess).toBeDefined();
            expect($scope.handleSuccess).toBeAFunction();
        }));

        describe("handleSuccess", function() {
            beforeEach(function () {
                $scope.handleSuccess('teachers', { id: 90210 });
            });

            it('should add an entry to the importProcesses map when run', function() {
                expect($scope.importProcesses.teachers).toBeDefined();
                expect($scope.importProcesses.teachers).toEqual(90210);
            });
        });

        it('should contain a callback to handle transitioning to the next state', inject(function() {
            expect($scope.nextStep).toBeDefined();
            expect($scope.nextStep).toBeAFunction();
        }));

        describe("nextStep", function() {
            beforeEach(function () {
                $scope.handleSuccess('students', { id: 90210 });
                $scope.nextStep();
            });

            it('should try to transition to the mapcolumns state when run', function() {
                expect(nextState).toEqual('techadmin.importcsv.mapcolumns');
            });

            it('should pass the import type and process id as parameters', function() {
                console.log(nextStateParams);
                expect(nextStateParams.importType).toEqual('students');
                expect(nextStateParams.processId).toEqual(90210);
            });
        });

        describe("nextStep with multiple files", function() {
            beforeEach(function () {
                $scope.handleSuccess('students', { id: 90210 });
                $scope.handleSuccess('classes',  { id: 90211 });
                $scope.nextStep();
            });

            it('should try to transition to the mapcolumns state when run', function() {
                expect(nextState).toEqual('techadmin.importcsv.mapcolumns');
            });

            it('should pass the import type and process id of the student import as parameters', function() {
                console.log(nextStateParams);
                expect(nextStateParams.importType).toEqual('students');
                expect(nextStateParams.processId).toEqual(90210);
            });
        });
    });

    /**
     * Test the ui-router state provider for this module
     */
    describe('state', function() {

        beforeEach(module('scentui'));
        beforeEach(module('scentui.techadmin'));
        beforeEach(module('scentui.techadmin.importcsv'));
        beforeEach(module('scentui.techadmin.importcsv.upload'));

        beforeEach(inject(function(scentTestService) {
            scentTestService.initCommon.call(this);
        }));

        it('should correspond to URL', inject(function($state) {
            expect($state.href('techadmin.importcsv.upload')).toEqual('#/techadmin/importcsv/upload');
        }));

        // TOOO: this test requires stubbing out the service calls at scentui.techadmin level,
        //       which is not a sustainable practice; fix this.

        // it('should go to "techadmin.importcsv.upload"', inject(function($state, $rootScope, $injector) {

        //     $state.go('techadmin.importcsv.upload');
        //     $rootScope.$apply();

        //     expect($state.is('techadmin.importcsv.upload'));

        //     expect($state.current.name).toBe('techadmin.importcsv.upload');
        //     expect($state.current.data.pageTitle).toBe('Import Roster CSV');
        // }));
    });
});
