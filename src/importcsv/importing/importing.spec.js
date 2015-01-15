describe('techadmin.importcsv.importing:', function () {

    'use strict';

    var stateParams = { importType: 'students',
                        processId: 90210 };

    stateParams.processes = [stateParams];


    beforeEach(module('scentui'));
    beforeEach(module('scentui.techadmin'));
    beforeEach(module('scentui.techadmin.importcsv'));
    beforeEach(module('scentui.techadmin.importcsv.importing',
                      function($provide) {
                          $provide.value('$stateParams', stateParams);
                      } ));


    describe('ImportCsvImportingCtrl', function() {

        var ImportCsvImportingCtrl,
            $scope,
            $location,
            $state;

        beforeEach( inject( function( $controller, _$location_, $rootScope ) {
            $location = _$location_;
            $scope    = $rootScope.$new();
            $state    = {
                current : { data: { pageTitle: 'Importing CSV File' }},
                params  : stateParams
            };

            ImportCsvImportingCtrl = $controller( 'ImportCsvImportingCtrl', {
                $location   : $location,
                $scope      : $scope,
                // currentUser : sunRa,
                $state      : $state
            });
        }));

        it( 'should exist', inject(function() {
            expect(ImportCsvImportingCtrl).toBeTruthy();
        }));

        it('should contain a value for time remaining to import the file', inject(function() {
            expect($scope.timeLeft).toBeDefined();
            expect($scope.timeLeft).toEqual(jasmine.any(String));
        }));
    });

    /**
     * Test the ui-router state provider for this module
     */
    describe('state', function() {

        it('should correspond to URL', inject(function($state) {
            expect($state.href('techadmin.importcsv.importing')).toEqual('#/techadmin/importcsv/importing');
        }));


        // TOOO: this test requires stubbing out the service calls at scentui.techadmin level,
        //       which is not a sustainable practice; fix this.

        // it('should go to "techadmin.importcsv.importing"', inject(function($state, $rootScope, $injector) {

        //     $state.go('techadmin.importcsv.importing');
        //     $rootScope.$apply();

        //     expect($state.is('techadmin.importcsv.importing'));

        //     expect($state.current.name).toBe('techadmin.importcsv.importing');
        //     expect($state.current.data.pageTitle).toBe('Import Roster CSV');
        // }));
    });
});
