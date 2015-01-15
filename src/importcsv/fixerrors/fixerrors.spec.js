describe('techadmin.importcsv.fixerrors:', function () {

    'use strict';

    var stateParams = { importType: 'students', processId: 90210 };

    beforeEach(module('scent.test.common'));
    beforeEach(module('scent.test.core.csv-errors'));

    describe('ImportCsvFixErrorsController', function() {

        beforeEach(module('scentui.techadmin.importcsv.fixerrors',
                          function($provide) {
                              $provide.value('$stateParams', { importType: 'students' });
                          } ));

        beforeEach(module('scentui.techadmin.importcsv.steps'));
        beforeEach(module('scentui.test.techadmin.importcsv.steps'));

        beforeEach(inject(function(importStepsService, fakeImportProcesses) {
            importStepsService.setProcesses(fakeImportProcesses);
        }));

        var ImportCsvFixErrorsController,
            $scope,
            $state,
            nextState,
            nextStateParams;

        beforeEach( inject( function( $controller, $rootScope, fakeErrors ) {
            $scope = $rootScope.$new();
            $state = {
                current : { data: { pageTitle: 'Fix Errors' }},
                params  : stateParams,
                go      : function (state, params) {
                    nextState       = state;
                    nextStateParams = params;
                }};

            ImportCsvFixErrorsController = $controller( 'ImportCsvFixErrorsController', {
                $scope       : $scope,
                $state       : $state,
                $stateParams : stateParams,
                errors       : fakeErrors
            });
        }));


        beforeEach(inject(function(scentTestService) {
            scentTestService.initCommon.call(this);
        }));


        it( 'should exist', function() {
            expect(ImportCsvFixErrorsController).toBeTruthy();
        });

        it('should contain an import type', function() {
            expect($scope.importType).toBeDefined();
            expect($scope.importType).toEqual('students');
        });

        it('should contain a process id', function() {
            expect($scope.processId).toBeDefined();
            expect($scope.processId).toEqual(90210);
        });

        it('should contain a map of rows that failed validation, ' +
            ' where the key is the row number and the value is the row data in an array', function() {
            expect($scope.rows).toBeDefined();
            expect($scope.rows).toBeAnObject();
            expect(Object.keys($scope.rows).length).toEqual(3);

            expect($scope.rows[2]).toBeTruthy();
            expect($scope.rows[2]).toBeAnArray();
        });

        it('should contain a list of column names', function() {
            expect($scope.columns).toBeDefined();
            expect($scope.columns).toBeAnArray();
        });

        it('should contain a list of validation errors', function() {
            expect($scope.errors).toBeDefined();
            expect($scope.errors).toBeAnArray();
        });

        describe("row data and column names", function() {

            it('should have the same number of items', function() {
                for (var rownumber in $scope.rows) {
                    expect($scope.rows[rownumber].length).toEqual($scope.columns.length);
                }
            });
        });


        it('should contain a function to create a single key from the row and column numbers of a cell', function() {
            expect($scope.cellkey).toBeDefined();
            expect($scope.cellkey).toBeAFunction();

            expect($scope.cellkey(1,2)).toEqual('1,2');
        });

        it('should contain a map from cell keys to errors and cell contents', function() {
            expect($scope.errorMap).toBeDefined();
            expect($scope.errorMap).toBeAnObject();

            expect(Object.keys($scope.errorMap).length).toEqual(3);
        });

        describe("error record in error map", function() {

            var error;

            beforeEach(function() {
                error = $scope.errorMap['3,1'];
            });

            it('should exist for the cell in row 3, column 1', function() {
                expect(error).toBeTruthy();
            });

            it('should contain a value for the invalid cell', function() {
                expect(error.value).toBeTruthy();
                expect(error.value).toBeAString();
                expect(error.value).toEqual('13');
            });

            it('should contain an error description', function() {
                expect(error.error).toBeTruthy();
                expect(error.error).toBeAString();
                expect(error.error).toEqual('out of range');
            });
        });

        it('should contain a function that returns true if the given cell has an error', function() {
            expect($scope.hasError).toBeDefined();
            expect($scope.hasError).toBeAFunction();

            expect($scope.hasError(3,1)).toBe(true);
            expect($scope.hasError(3,2)).toBe(false);
        });


        it('should contain a callback to handle moving to the next state', function() {
            expect($scope.nextStep).toBeDefined();
            expect($scope.nextStep).toBeAFunction();
        });

        describe("nextStep", function() {

            it('should persist the corrections to local storage', inject(function(localStorageService) {

                var corrections = localStorageService.get('corrections.students');

                expect(corrections).not.toBeTruthy();

                $scope.nextStep();

                corrections = localStorageService.get('corrections.students');

                console.log(corrections);
                expect(corrections).toBeDefined();
                expect(Object.keys(corrections)).toContain('2,2');
            }));

            describe("when run with pending import steps", function() {

                beforeEach(function () {
                    $scope.nextStep();
                });

                it('should try to transition back to the fixerrors state', function() {
                    expect(nextState).toEqual('techadmin.importcsv.fixerrors');
                });

                it('should pass the import type and process id as parameters', function() {
                    // console.log(nextStateParams);
                    expect(nextStateParams.importType).toEqual('teachers');
                    expect(nextStateParams.processId).toEqual(90211);
                });
            });

            describe("when run with no further import steps", function() {

                beforeEach(inject(function (importStepsService) {
                    importStepsService.reset();
                    $scope.nextStep();
                }));

                it('should try to transition to the importing state', function() {
                    expect(nextState).toEqual('techadmin.importcsv.importing');
                });

                it('should contain no additional parameters', function() {
                    expect(nextStateParams).not.toBeTruthy();
                });

                // it('should pass the import type and process id as parameters', function() {
                //     // console.log(nextStateParams);
                //     expect(nextStateParams.importType).toEqual('students');
                //     expect(nextStateParams.processId).toEqual(90210);
                // });
            });
        });
    });

    /**
     * Test the ui-router state provider for this module
     */
    describe('state', function() {

        var csvErrorsService = {},
            backgroundProcessPerOrgService = {};

        beforeEach(module('scentui'));
        beforeEach(module('scentui.techadmin',
                          function($provide) {
                              $provide.value('backgroundProcessPerOrgService', backgroundProcessPerOrgService);
                          } ));

        beforeEach(module('scentui.techadmin.importcsv'));
        beforeEach(module('scentui.techadmin.importcsv.fixerrors',
                          function($provide) {
                              $provide.value('csvErrorsService', csvErrorsService);
                          } ));

        beforeEach(inject(function(scentTestService) {
            scentTestService.initCommon.call(this);
        }));


        beforeEach( function() {
            backgroundProcessPerOrgService.query = jasmine.createSpy('query').andReturn([]);
        });

        beforeEach( inject( function(fakeErrors) {
            csvErrorsService.query = jasmine.createSpy('query').andReturn(fakeErrors);
        }));


        it('should correspond to URL', inject(function($state) {
            expect($state.href('techadmin.importcsv.fixerrors', stateParams))
                .toEqual('#/techadmin/importcsv/fixerrors/students/90210');
        }));

        xit('should load the csv column map data when you go to "techadmin.importcsv.fixerrors"', inject(function($state, $rootScope, $injector, fakeErrors) {

            $state.go('techadmin.importcsv.fixerrors', stateParams);
            $rootScope.$apply();

            expect($state.is('techadmin.importcsv.fixerrors'));

            expect($state.current.name).toBe('techadmin.importcsv.fixerrors');
            expect($state.current.data.pageTitle).toBe('Fix Errors');

            //    expect($state.current.resolve.errors).toEqual(fakeErrors);
            expect($injector.invoke($state.current.resolve.errors)).toEqual(fakeErrors);
        }));
    });
});
