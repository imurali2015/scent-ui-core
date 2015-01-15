(function (angular, undefined) {

    'use strict';

    var students = { importType: 'students', processId: 90210 };
    var teachers = { importType: 'teachers', processId: 90211 };
    var classes  = { importType: 'classes',  processId: 90212 };
    var steps    = [ students, teachers, classes ];

    var importProcesses = {
        'students' : 90210,
        'teachers' : 90211,
        'classes'  : 90212
    };


    angular.module('scentui.test.techadmin.importcsv.steps', ['LocalStorageModule'])
           .constant('fakeSteps', steps)
           .constant('fakeImportProcesses', importProcesses)
           .config(function(localStorageServiceProvider) {
                localStorageServiceProvider
                    .setPrefix('scentui.test.techadmin')
                    .setStorageType('sessionStorage');
           });

})(window.angular);



describe('Service:', function() {

    'use strict';

    var stateParams = { importType: 'students', processId: 90210 };
    var importProcesses;

    beforeEach(module('scent.test.common'));
    beforeEach(module('scentui.test.techadmin.importcsv.steps'));

    beforeEach(module('scentui.techadmin.importcsv.steps',
                      function($provide) {
                          $provide.value('$stateParams', stateParams);
                      } ));

    beforeEach(inject(function(scentTestService, localStorageService, fakeImportProcesses) {
        scentTestService.initCommon.call(this);
        localStorageService.clearAll();

        importProcesses = fakeImportProcesses;
    }));


    describe('importStepsService', function () {


        beforeEach(function() {
            this.addMatchers({
                toBeInAnInvalidState: function () {

                    var importStepsService = this.actual;

                    expect(importStepsService.steps()).toEqual([]);
                    expect(importStepsService.first()).not.toBeDefined();
                    expect(importStepsService.index('students')).toEqual(-1);
                    expect(importStepsService.step('students')).not.toBeDefined();
                    expect(importStepsService.next('students')).not.toBeDefined();

                    return true;
                }
            });
        });


        it('should exist', inject(function (importStepsService) {
            expect(importStepsService).toBeDefined();
        }));

        it('should be an object', inject(function (importStepsService) {
            expect(importStepsService).toBeAnObject();
        }));

        it('should point to nothing when first created', inject(function (importStepsService) {

            expect(importStepsService).toBeInAnInvalidState();
        }));

        it('should point to nothing when initialized with something invalid', inject(function (importStepsService) {

            importStepsService.setProcesses({});
            expect(importStepsService).toBeInAnInvalidState();

            importStepsService.setProcesses([]);
            expect(importStepsService).toBeInAnInvalidState();
        }));


        describe('steps from process map', function () {

            var steps;
            var localStorage;

            beforeEach(inject(function(importStepsService, localStorageService) {
                importStepsService.setProcesses(importProcesses);

                steps        = importStepsService;
                localStorage = localStorageService;
            }));

            it('should contain an array of steps when initialized', inject(function (fakeSteps) {

                expect(steps.steps()).toBeTruthy();
                expect(steps.steps()).toBeAnArray();
                expect(steps.steps()).toEqual(fakeSteps);
            }));

            it('should contain "students" as the first step when initialized', inject(function (fakeSteps) {

                expect(steps.first()).toBeTruthy();
                expect(steps.first()).toEqual(fakeSteps[0]);
                expect(steps.index('students')).toEqual(0);
                expect(steps.step('students')).toBeTruthy();
                expect(steps.step('students')).toEqual(fakeSteps[0]);
                expect(steps.next('students')).toBeTruthy();
                expect(steps.next('students')).toEqual(fakeSteps[1]);
            }));

            it('should contain "teachers" as the first step when initialized', inject(function (fakeSteps) {

                expect(steps.index('teachers')).toEqual(1);
                expect(steps.step('teachers')).toBeTruthy();
                expect(steps.step('teachers')).toEqual(fakeSteps[1]);
                expect(steps.next('teachers')).toBeTruthy();
                expect(steps.next('teachers')).toEqual(fakeSteps[2]);
            }));

            it('should contain "classes" as the last step when initialized', inject(function (fakeSteps) {

                expect(steps.index('classes')).toEqual(2);
                expect(steps.step('classes')).toBeTruthy();
                expect(steps.step('classes')).toEqual(fakeSteps[2]);
                expect(steps.next('classes')).not.toBeTruthy();
            }));


            it('should point to nothing when queried with a nonexistent import type', function () {

                expect(steps.step('blah')).not.toBeTruthy();
                expect(steps.index('blah')).toEqual(-1);
            });


            it("should persist the import processes map to local storage", function() {
                expect(localStorage.get('importProcesses')).toBeTruthy();
                expect(localStorage.get('importProcesses')).toBeAnObject();
                expect(localStorage.get('importProcesses')).toEqual(importProcesses);
            });

            it("should point to nothing when reset", function() {
                steps.reset();

                expect(steps).toBeInAnInvalidState();
            });

            it("should remove importProcesses from local storage when reset", function() {
                steps.reset();

                expect(localStorage.get('importProcesses')).not.toBeTruthy();
            });

        });

        it('should use existing import processes from local storage when initialized with no inputs', inject(function (importStepsService, fakeSteps) {

            importStepsService.setProcesses(importProcesses);   // initialize, put in local storage
            importStepsService.setProcesses();                  // reinitialize with no params

            expect(importStepsService.steps()).toBeTruthy();
            expect(importStepsService.steps()).toBeAnArray();
            expect(importStepsService.steps()).toEqual(fakeSteps);

        }));

        it('should use the single import process specified by the state params when initialized with no inputs and nothing is in local storage', inject(function (importStepsService) {

            importStepsService.setProcesses();                  // initialize with no params

            expect(importStepsService.steps()).toBeTruthy();
            expect(importStepsService.steps()).toBeAnArray();
            expect(importStepsService.steps().length).toEqual(1);

            expect(importStepsService.first()).toBeTruthy();
            expect(importStepsService.first()).toEqual(stateParams);
            expect(importStepsService.next(stateParams.importType)).not.toBeTruthy();
        }));
    });
});
