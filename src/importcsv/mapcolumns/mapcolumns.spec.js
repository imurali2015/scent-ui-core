describe('techadmin.importcsv.mapcolumns:', function () {

    'use strict';

    var stateParams = { importType: 'students', processId: 90210 };

    beforeEach(module('scent.test.common'));
    beforeEach(module('scent.test.core.csv-column-map'));
    beforeEach(module('scent.test.core.csv-rows'));

    describe('countMappedFilter', function() {

        beforeEach(module('scentui.techadmin.importcsv.mapcolumns',
                          function($provide) {
                              $provide.value('$stateParams', stateParams);
                          } ));

        beforeEach(inject(function(scentTestService) {
            scentTestService.initCommon.call(this);
        }));

        it('should exist', inject(function($filter) {
            expect($filter('countMapped')).toBeTruthy();
        }));

        it('should exist, really', inject(function(countMappedFilter) {
            expect(countMappedFilter).toBeTruthy();
        }));

        it('should handle undefined mappings', inject(function(countMappedFilter) {
            expect(countMappedFilter()).toBeANumber();
            expect(countMappedFilter()).toEqual(0);
        }));

        it('should handle null mappings', inject(function(countMappedFilter) {
            expect(countMappedFilter(null)).toBeANumber();
            expect(countMappedFilter(null)).toEqual(0);
        }));

        it('should handle empty mappings', inject(function(countMappedFilter) {
            expect(countMappedFilter({})).toBeANumber();
            expect(countMappedFilter({})).toEqual(0);
        }));


        it('should handle mappings with no matches', inject(function(countMappedFilter) {

            var mapping = { cheese: 1, bagels: 2 };

            expect(countMappedFilter(mapping)).toBeANumber();
            expect(countMappedFilter(mapping)).toEqual(0);
        }));

        it('should handle mappings with matches', inject(function(countMappedFilter) {

            var mapping = { 'Student ID': 1, 'Allergies': 2 };

            expect(countMappedFilter(mapping)).toBeANumber();
            expect(countMappedFilter(mapping)).toEqual(1);
        }));

        it('should ignore mappings with undefined values', inject(function(countMappedFilter) {

            var mapping = { 'Student ID': undefined, 'Allergies': 2 };

            expect(countMappedFilter(mapping)).toBeANumber();
            expect(countMappedFilter(mapping)).toEqual(0);
        }));

        it('should ignore mappings with null values', inject(function(countMappedFilter) {

            var mapping = { 'Student ID': null, 'Allergies': 2 };

            expect(countMappedFilter(mapping)).toBeANumber();
            expect(countMappedFilter(mapping)).toEqual(0);
        }));
    });

    describe('cellForColumnFilter', function() {

        var cellForColumnFilter,
            row,
            columnMap;

        beforeEach(module('scentui.techadmin.importcsv.mapcolumns',
                          function($provide) {
                              $provide.value('$stateParams', stateParams);
                          } ));

        beforeEach(inject(function(scentTestService) {
            scentTestService.initCommon.call(this);
        }));

        beforeEach(inject(function(_cellForColumnFilter_, fakeRows, fakeColumnMap, _) {
            cellForColumnFilter = _cellForColumnFilter_;
            row                 = fakeRows.rows['1'];
            columnMap           = _.clone(fakeColumnMap);
        }));

        // columns = ["Grade", "SIS ID", "Given Name", "Family Name", "M.I.", "Allergies", "Email address"],
        // row     = ["K", "001", "John", "Gilmore", "", "", "jgilmore@saturn.edu"],
        // mapping = { "Last Name"  : "Family Name",
        //             "First Name" : "Given Name",
        //             "Grade"      : "Grade",
        //             "Email"      : "Email address" },

        it('should exist', inject(function($filter) {
            expect($filter('cellForColumn')).toBeTruthy();
        }));


        it('should handle the normal case', function() {
            expect(cellForColumnFilter(row, 'Email', columnMap)).toBeDefined();
            expect(cellForColumnFilter(row, 'Email', columnMap)).toEqual('jgilmore@saturn.edu');
        });


        it('should handle undefined system columns', function() {
            expect(cellForColumnFilter(row, undefined, columnMap)).not.toBeDefined();
        });

        it('should handle null system columns', function() {
            expect(cellForColumnFilter(row, null, columnMap)).not.toBeDefined();
        });

        it('should handle nonexistent system columns', function() {
            expect(cellForColumnFilter(row, 'Blah', columnMap)).not.toBeDefined();
        });

        it('should handle empty mappings', function() {
            columnMap.mapping = {};

            expect(cellForColumnFilter(row, 'Grade', columnMap)).not.toBeDefined();
        });

        it('should handle null mappings', function() {
            columnMap.mapping.Blah = null;

            expect(cellForColumnFilter(row, 'Blah', columnMap)).not.toBeDefined();
        });

        it('should handle the normal case', function() {
            expect(cellForColumnFilter(row, 'Email', columnMap)).toBeDefined();
            expect(cellForColumnFilter(row, 'Email', columnMap)).toEqual('jgilmore@saturn.edu');
        });

        it('should handle cells with no data', function() {

            var row = ["K", "001", "John", "Gilmore", "", "", ""];

            expect(cellForColumnFilter(row, 'Email', columnMap)).toBeDefined();
            expect(cellForColumnFilter(row, 'Email', columnMap)).toEqual('');
        });

        it('should handle rows with no data', function() {

            var row = [];

            expect(cellForColumnFilter(row, 'Email', columnMap)).not.toBeDefined();
        });
    });

    describe('ImportCsvMapColumnsCtrl', function() {

        beforeEach(module('scentui.techadmin.importcsv.mapcolumns',
                          function($provide) {
                              $provide.value('$stateParams', stateParams);
                          } ));

        beforeEach(module('scentui.techadmin.importcsv.steps'));
        beforeEach(module('scentui.test.techadmin.importcsv.steps'));

        beforeEach(inject(function(importStepsService, fakeImportProcesses) {
            importStepsService.setProcesses(fakeImportProcesses);
        }));


        var ImportCsvMapColumnsCtrl,
            $scope,
            $state,
            nextState,
            nextStateParams;

        beforeEach( inject( function( $controller, $rootScope, fakeColumnMap, fakeRows ) {
            $scope = $rootScope.$new();
            $state = {
                current : { data: { pageTitle: 'Map Columns' }},
                params  : stateParams,
                go      : function (state, params) {
                    nextState       = state;
                    nextStateParams = params;
                }};

            ImportCsvMapColumnsCtrl = $controller( 'ImportCsvMapColumnsCtrl', {
                $scope       : $scope,
                $state       : $state,
                $stateParams : stateParams,
                columnMap    : fakeColumnMap,
                rows         : fakeRows
            });
        }));


        beforeEach(inject(function(scentTestService) {
            scentTestService.initCommon.call(this);
        }));

        it( 'should exist', function() {
            expect(ImportCsvMapColumnsCtrl).toBeTruthy();
        });

        it('should contain an import type', function() {
            expect($scope.importType).toBeDefined();
            expect($scope.importType).toEqual('students');
        });

        it('should contain a process id', function() {
            expect($scope.processId).toBeDefined();
            expect($scope.processId).toEqual(90210);
        });

        it('should contain a list of steps', function() {

            var steps = $scope.steps;

            expect(steps).toBeDefined();
            expect(steps).toBeAnObject();
            expect(Object.keys(steps).length).toBe(3);

            expect(steps[0]).toBeTruthy();
            expect(steps[0]).toBeAnObject();
            expect(steps[0].importType).toBeTruthy();
            expect(steps[0].importType).toEqual('students');
            expect(steps[0].processId).toEqual(90210);
        });

        it('should contain a callback to handle moving to the next state', function() {
            expect($scope.nextStep).toBeDefined();
            expect($scope.nextStep).toBeAFunction();
        });

        describe("nextStep", function() {

            it('should persist the column mappings to local storage', inject(function(localStorageService) {

                var mapping = localStorageService.get('columnMap.students');

                expect(mapping).not.toBeTruthy();

                $scope.nextStep();

                mapping = localStorageService.get('columnMap.students');

                console.log(mapping);
                expect(mapping).toBeDefined();
                expect(Object.keys(mapping)).toContain('Last Name');
            }));

            describe("when run with pending import steps", function() {

                beforeEach(function () {
                    $scope.nextStep();
                });

                it('should try to transition back to the mapcolumns state', function() {
                    expect(nextState).toEqual('techadmin.importcsv.mapcolumns');
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

        var csvColumnMapService = {},
            csvRowsService = {},
            backgroundProcessPerOrgService = {};

        beforeEach(module('scentui'));
        beforeEach(module('scentui.techadmin',
                          function($provide) {
                              $provide.value('backgroundProcessPerOrgService', backgroundProcessPerOrgService);
                          } ));

        beforeEach(module('scentui.techadmin.importcsv'));
        beforeEach(module('scentui.techadmin.importcsv.mapcolumns',
                          function($provide) {
                              $provide.value('csvColumnMapService', csvColumnMapService);
                              $provide.value('csvRowsService',      csvRowsService);
                          } ));

        beforeEach(inject(function(scentTestService) {
            scentTestService.initCommon.call(this);
        }));


        beforeEach( function() {
            backgroundProcessPerOrgService.query = jasmine.createSpy('query').andReturn([]);
        });

        beforeEach( inject( function(fakeColumnMap) {
            csvColumnMapService.query = jasmine.createSpy('query').andReturn(fakeColumnMap);
        }));


        it('should correspond to URL', inject(function($state) {
            expect($state.href('techadmin.importcsv.mapcolumns', stateParams))
                .toEqual('#/techadmin/importcsv/mapcolumns/students/90210');
        }));

        xit('should load the csv column map data when you go to "techadmin.importcsv.mapcolumns"', inject(function($state, $rootScope, $injector, fakeColumnMap) {

            $state.go('techadmin.importcsv.mapcolumns', stateParams);
            $rootScope.$apply();

            expect($state.is('techadmin.importcsv.mapcolumns'));

            expect($state.current.name).toBe('techadmin.importcsv.mapcolumns');
            expect($state.current.data.pageTitle).toBe('Map Columns');

            // expect($state.current.resolve.columnMap).toEqual(fakeColumnMap);
            expect($injector.invoke($state.current.resolve.columnMap)).toEqual(fakeColumnMap);
        }));
    });
});
