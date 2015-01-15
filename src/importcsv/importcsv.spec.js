describe('techadmin importcsv:', function () {

    'use strict';

    /**
     * Test the ui-router state provider for this module
     */
    describe('state', function() {

        var backgroundProcessPerOrgService = {};

        beforeEach(module('scentui'));
        beforeEach(module('scentui.techadmin',
                          function($provide) {
                              $provide.value('backgroundProcessPerOrgService', backgroundProcessPerOrgService);
                          } ));

        beforeEach(module('scentui.techadmin.importcsv'));

        beforeEach( inject( function() {
            backgroundProcessPerOrgService.query = jasmine.createSpy('query').andReturn([]);
        }));


        it('should correspond to URL', inject(function($state) {
            expect($state.href('techadmin.importcsv')).toEqual('#/techadmin/importcsv');
        }));

        it('should go directly to "techadmin.importcsv.upload"', inject(function($state, $rootScope, $controller) {

            $state.go('techadmin.importcsv');
            $rootScope.$apply();

            expect($state.is('techadmin.importcsv'));

            $controller($state.current.controller, {
                $scope : $rootScope.$new(),
                $state : $state
            });

            expect($state.is('techadmin.importcsv.upload'));

            // expect($state.current.name).toBe('techadmin.importcsv.upload');
            // expect($state.current.data.pageTitle).toBe('Import Roster CSV');
        }));
    });
});
