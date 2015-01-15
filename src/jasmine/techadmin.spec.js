describe('techadmin:', function () {

    'use strict';

    var sunRa = {
                    userId    : 'sunra',
                    orgId     : 90210,
                    firstName : 'Sun',
                    lastName  : 'Ra'
                };

    var importJobs = [
          {
            "id"              : 32,
            "orgId"           : 90210,
            "userId"          : "sunra",
            "processToken"    : "f5fb4e39-7e4b-480b-9ce1-440b77a95ff5",
            "filename"        : "nyc_teachers.csv",
            "status"          : "completed",
            "createdAt"       : "Mon Nov 10 2014 09:20:33 GMT-0500 (EST)",
            "updatedAt"       : "Mon Nov 10 2014 13:20:45 GMT-0500 (EST)",
            "percentComplete" : 100
          },
          {
            "id"              : 33,
            "orgId"           : 90210,
            "userId"          : "sunra",
            "processToken"    : "f5fb4e39-7e4b-480b-9ce1-440b77a95ff6",
            "filename"        : "nyc_students.csv",
            "status"          : "validating",
            "createdAt"       : "Mon Nov 10 2014 09:45:26 GMT-0500 (EST)",
            "updatedAt"       : "Mon Nov 10 2014 13:20:45 GMT-0500 (EST)",
            "percentComplete" : 50
          }
        ];

    beforeEach(module('scent.test.common'));



    /**
     * Tests sit right alongside the file they are testing, which is more intuitive
     * and portable than separating `src` and `test` directories. Additionally, the
     * build process will exclude all `.spec.js` files from the build
     * automatically.
     */
    describe('TechAdminCtrl', function() {

        var TechAdminCtrl,
            $scope,
            $location;

        beforeEach(module('scentui.techadmin'));
        beforeEach(module('scentui.techadmin.importcsv'));
        beforeEach(module('scentui.techadmin.importcsv.upload'));

        beforeEach(inject(function(scentTestService) {
            scentTestService.initCommon.call(this);
        }));


        beforeEach( inject( function( $controller, _$location_, $rootScope ) {
            $location = _$location_;
            $scope    = $rootScope.$new();
            TechAdminCtrl = $controller( 'TechAdminCtrl', {
                $location   : $location,
                $scope      : $scope,
                currentUser : sunRa,
                $state      : { current: { data: { pageTitle: 'Tech Admin' }}},
                processes   : importJobs
            });
        }));

        it( 'should exist', inject( function() {
            expect( TechAdminCtrl ).toBeTruthy();
        }));

        it( 'should have techadmin info', inject( function() {
            expect( $scope.user ).toBeDefined();
            expect( $scope.user.userId ).toBe('sunra');
            expect( $scope.user.firstName ).toBe('Sun');
        }));

        it( 'should have a school name', inject( function() {
            expect( $scope.schoolName ).toBeDefined();
        }));

        it( 'should have a space title', inject( function() {
            expect( $scope.appSpaceTitle ).toBeDefined();
            expect( $scope.appSpaceTitle ).toBe('Tech Admin');
        }));

        it( 'should have an array of 2 processes', inject( function() {
            expect( $scope.processes ).toBeDefined();
            expect( $scope.processes ).toBeAnArray();
            expect( $scope.processes.length ).toBe(importJobs.length);
        }));

        it( 'should have a drop down status', inject( function() {
            expect( $scope.dropDownStatus ).toBeDefined();
            expect( $scope.dropDownStatus.isopen ).toBe(false);
        }));

        it( 'should have a function to toggle the drop down status', inject( function() {
            expect( $scope.toggleDropdown ).toBeDefined();
            expect( $scope.toggleDropdown ).toBeAFunction();
        }));

        it( 'should have a function to toggle the drop down status that does in fact toggle the status', inject( function() {

            expect( $scope.dropDownStatus.isopen ).toBe(false);

            var event = document.createEvent("MouseEvent");

            $scope.toggleDropdown(event);

            expect( $scope.dropDownStatus.isopen ).toBe(true);

            $scope.toggleDropdown(event);

            expect( $scope.dropDownStatus.isopen ).toBe(false);
        }));
    });



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

        beforeEach( inject( function() {
            backgroundProcessPerOrgService.query = jasmine.createSpy('query').andReturn(importJobs);
        }));

        it('should correspond to URL', inject(function($state) {
            expect($state.href('techadmin')).toEqual('#/techadmin');
        }));

        it('should contain techadmin data when you go to "techadmin"', inject(function($state, $rootScope, $injector) {

            $state.go('techadmin');
            $rootScope.$apply();

            expect($state.is('techadmin'));

            expect($state.current.name).toBe('techadmin');
            expect($state.current.data.pageTitle).toBe('Tech Admin');

            expect($injector.invoke($state.current.views.main.resolve.processes)).toEqual(importJobs);
        }));
    });
});
