(function (angular, undefined) {

    'use strict';

    var errors = {
            "id"        : 90210,
            "filename"  : "nyc_students.csv",
            "columns"   : ["Grade", "SIS ID", "Given Name", "Family Name", "M.I.", "Allergies", "Email address"],
            "rows"      : {
                "2" :  ["1", "-------", "Marshall", "Allen", "", "Peanut", "mallen@saturn.edu"],
                "3" :  ["13", "004", "Pat", "Patrick", "", "", "ppatrick@saturn.edu"],
                "5" :  ["4", "017", "", "Tyson", "", "", "jtyson@saturn.edu"]
            },
            "errors"    : [ { "row" : 2, "col": 2, "error" : "invalid value" },
                            { "row" : 3, "col": 1, "error" : "out of range"  },
                            { "row" : 5, "col": 3, "error" : "missing value" } ]
        };


    angular.module('scent.test.core.csv-errors', [])
           .constant('fakeErrors', errors);

})(window.angular);



describe('Service:', function() {

    'use strict';

    beforeEach(module('scent.core.csv-errors'));

    beforeEach(module('scent.test.common'));
    beforeEach(module('scent.test.core.csv-errors'));

    beforeEach(inject(function(scentTestService) {
        scentTestService.initCommon.call(this);
    }));


    describe('scent.core.csv-errors', function () {

        describe('csvErrorsService', function () {

            it('should exist', inject(function (csvErrorsService) {
                expect(csvErrorsService).toBeDefined();
            }));


            it('should issue a GET request when queried', inject(function (csvErrorsService, $httpBackend, baseUrl, fakeErrors) {

                $httpBackend.expectGET(baseUrl + '/csvImports/90210/errors')
                            .respond(fakeErrors);

                var errors = csvErrorsService.query({ processId : 90210 });

                $httpBackend.flush();

                expect(errors).toBeDefined();
                expect(errors).toBeAnObject();
            }));

            describe('GET response', function () {

                var errors;

                beforeEach(inject(function (csvErrorsService, $httpBackend, baseUrl, fakeErrors) {

                    $httpBackend.expectGET(baseUrl + '/csvImports/90210/errors')
                                .respond(fakeErrors);

                    errors = csvErrorsService.query({ processId : 90210 });

                    $httpBackend.flush();
                }));

                it("should return an object with an id field", function() {
                    expect(errors.id).toBeDefined();
                    expect(errors.id).toEqual(90210);
                });

                it("should return an object with a list of CSV column names", function() {
                    expect(errors.columns).toBeDefined();
                    expect(errors.columns).toBeAnArray();
                    expect(errors.columns).toContain('Allergies');
                });
            });
        });

    });
});
