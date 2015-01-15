describe('upload file directive:', function () {

    'use strict';

    var sunRa = {
                    userId    : 'sunra',
                    orgId     : 90210,
                    firstName : 'Sun',
                    lastName  : 'Ra'
                };

    var backgroundProcessUploadService = {};

    var $timeout = jasmine.createSpy('timeout').andCallFake(function (fn, delay) {

            if (delay) {
                console.log('in real life, we would wait this long: ', delay);
            }

            fn();

            // TODO: these functions nested inside a timeout are hard to test -- particularly when the timeouts are themselves inside a callback...
        });

    beforeEach(module('scent.test.common'));
    beforeEach(module('templates-common'));
    beforeEach(module('scent.uploadFile',
                      function($provide) {
                          $provide.value('backgroundProcessUploadService', backgroundProcessUploadService);
                          $provide.value('currentUser', sunRa);
                          $provide.value('$timeout', $timeout);
                      } ));

    beforeEach(inject(function(scentTestService) {
        scentTestService.initCommon.call(this);
    }));


    var element, $scope;

    beforeEach( inject( function($rootScope, $compile) {

        $rootScope.onSuccess = jasmine.createSpy('onSuccess');
        $rootScope.onError   = jasmine.createSpy('onError');

        // Compile a piece of HTML containing the directive

        element = $compile('<upload-file type="student" success="onSuccess()" error="onError()"/>')($rootScope);

        // fire all the watches, so the scope expressions will be evaluated
        $rootScope.$apply();

        $scope  = element.isolateScope();
    }));


    it('replaces the upload-file element with the angular-file-upload contents', function() {

        // Check that the compiled element contains the templated content

        expect(element.find('[ng-file-drop]')[0]).toBeAnObject();
        expect(element.find('[ng-file-select]')[0]).toBeAnObject();
        expect(element.find('progressbar')[0]).toBeAnObject();

        // console.log('[ng-file-select]', element.find('[ng-file-select]')[0]);
    });


    describe('uploadFile controller scope', function() {

        it( 'should exist', function() {
            expect( $scope ).toBeTruthy();
        });

        it( 'should have a file type', function() {
            expect( $scope.percentage ).toBeDefined();
            expect( $scope.percentage ).toBeANumber();
        });

        it( 'should have a percentage value', function() {
            expect( $scope.percentage ).toBeDefined();
            expect( $scope.percentage ).toBeANumber();
        });

        it('should contain a function that implements file upload', function() {
            expect($scope.onFileSelect).toBeDefined();
            expect($scope.onFileSelect).toBeAFunction();
        });

        describe("uploadInProgress function", function() {
            it('should exist', function() {
                expect($scope.uploadInProgress).toBeDefined();
                expect($scope.uploadInProgress).toBeAFunction();
            });

            it('should return true iff the percentage is > 0', function() {
                $scope.percentage = 0;

                expect($scope.uploadInProgress()).toBe(false);

                $scope.percentage = 10;

                expect($scope.uploadInProgress()).toBe(true);
            });

        });

        describe('onFileSelect', function () {

            var csvFile = [{
                    "webkitRelativePath" : "",
                    "lastModified"       : 1415915294000,
                    "lastModifiedDate"   : "2014-11-13T21:48:14.000Z",
                    "name"               : "is_interested_in.csv",
                    "type"               : "text/csv",
                    "size"               : 208409037
                }];

            var progressFn, successFn, errorFn;

            beforeEach(function () {

                backgroundProcessUploadService.upload   = jasmine.createSpy('upload'  ).andReturn(backgroundProcessUploadService);
                backgroundProcessUploadService.progress = jasmine.createSpy('progress').andCallFake(function (fn) { progressFn = fn; return backgroundProcessUploadService; });
                backgroundProcessUploadService.success  = jasmine.createSpy('success' ).andCallFake(function (fn) { successFn  = fn; return backgroundProcessUploadService; });
                backgroundProcessUploadService.error    = jasmine.createSpy('error'   ).andCallFake(function (fn) { errorFn    = fn; return backgroundProcessUploadService; });

                $scope.onFileSelect(csvFile);
            });

            it( 'should call the upload service', function() {
                expect($scope.upload).toBeDefined();
                expect($scope.upload).toBeAnObject();

                expect(backgroundProcessUploadService.upload).toHaveBeenCalledWith('sunra', csvFile);
            });

            it( 'should have a file to upload', function() {
                expect($scope.file).toBeDefined();
                expect($scope.file).toBeAnObject();
                expect($scope.file.name).toEqual('is_interested_in.csv');
            });

            it( 'should have an indicator for how many files have been successfully uploaded', function() {
                expect($scope.uploadCount).toBeDefined();
                expect($scope.uploadCount).toBeANumber();
                expect($scope.uploadCount).toEqual(0);
            });

            it( 'should call the upload service', function() {
                expect($scope.upload).toBeDefined();
                expect($scope.upload).toBeAnObject();

                expect(backgroundProcessUploadService.upload).toHaveBeenCalledWith('sunra', csvFile);
            });

            it( 'should register a progress callback that updates the current percentage', function() {

                expect(backgroundProcessUploadService.progress).toHaveBeenCalled();
                expect(progressFn).toBeAFunction();

                progressFn({ loaded: 50, total: 100 });

                expect($scope.percentage).toEqual(50);
            });

            it( 'should register a success callback that resets the current percentage', function() {

                expect(backgroundProcessUploadService.success).toHaveBeenCalled();
                expect(successFn).toBeAFunction();

                successFn();    // run timeout callback immediately

                // TODO: test code that runs inside of $timeout

                expect($scope.percentage).toEqual(0);
            });

            it( 'should register a success callback that increments the upload count', function() {

                expect(backgroundProcessUploadService.success).toHaveBeenCalled();
                expect(successFn).toBeAFunction();

                successFn();    // run timeout callback immediately

                expect($scope.uploadCount).toEqual(1);
            });

            xit( 'should run any additional success callback provided by the caller', function() {

                successFn();    // run timeout callback immediately

                expect($scope.onSuccess).toHaveBeenCalled();
                    // TODO: figure out how set up this test so that onSuccess appears in the scope
            });

            it( 'should register an error callback', function() {

                expect(backgroundProcessUploadService.error).toHaveBeenCalled();
                expect(errorFn).toBeAFunction();

                errorFn();    // run timeout callback immediately

                expect($scope.percentage).toEqual(0);
            });
        });
    });
});
