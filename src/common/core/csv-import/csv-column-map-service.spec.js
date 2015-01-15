(function (angular, undefined) {

    'use strict';

    var columnMap = {
            "id"        : 90210,
            "filename"  : "nyc_students.csv",
            "columns"   : ["Grade", "SIS ID", "Given Name", "Family Name", "M.I.", "Allergies", "Email address"],
            "mapping"   : {
                "Last Name"  : "Family Name",
                "First Name" : "Given Name",
                "Grade"      : "Grade",
                "Email"      : "Email address" },
            "createdAt" : "Mon Nov 10 2014 09:20:33 GMT-0500 (EST)",
            "updatedAt" : "Mon Nov 10 2014 13:20:45 GMT-0500 (EST)" };

    angular.module('scent.test.core.csv-column-map', [])
           .constant('fakeColumnMap', columnMap);

})(window.angular);



describe('Service:', function() {

    'use strict';

    beforeEach(module('scent.test.common'));
    beforeEach(module('scent.core.csv-column-map'));
    beforeEach(module('scent.test.core.csv-column-map'));

    beforeEach(inject(function(scentTestService) {
        scentTestService.initCommon.call(this);
    }));


    describe('scent.core.csv-column-map', function () {

        describe("csvExpectedColumns constant", function() {
            it('should exist', inject(function(csvExpectedColumns) {
                expect(csvExpectedColumns).toBeDefined();
                expect(csvExpectedColumns).toBeAnObject();
            }));

            it('should contain column descriptions for students', inject(function(csvExpectedColumns) {
                expect(csvExpectedColumns.students).toBeDefined();
                expect(csvExpectedColumns.students).toBeAnObject();
            }));

            it('should contain required and optional column descriptions for students', inject(function(csvExpectedColumns) {
                expect(csvExpectedColumns.students.required).toBeDefined();
                expect(csvExpectedColumns.students.required).toBeAnArray();

                expect(csvExpectedColumns.students.optional).toBeDefined();
                expect(csvExpectedColumns.students.optional).toBeAnArray();
            }));
        });

        describe('csvColumnMapService', function () {

            it('should exist', inject(function (csvColumnMapService) {
                expect(csvColumnMapService).toBeDefined();
            }));


            it('should issue a GET request when queried', inject(function (csvColumnMapService, $httpBackend, baseUrl, fakeColumnMap) {

                $httpBackend.expectGET(baseUrl + '/csvImports/90210/columnMap')
                            .respond(fakeColumnMap);

                var map = csvColumnMapService.query({ processId : 90210 });

                $httpBackend.flush();

                expect(map).toBeDefined();
                expect(map).toBeAnObject();
            }));

            describe('GET response', function () {

                var map;

                beforeEach(inject(function (csvColumnMapService, $httpBackend, baseUrl, fakeColumnMap) {

                    $httpBackend.expectGET(baseUrl + '/csvImports/90210/columnMap')
                                .respond(fakeColumnMap);

                    map = csvColumnMapService.query({ processId : 90210 });

                    $httpBackend.flush();
                }));

                it("should return an object with an id field", function() {
                    expect(map.id).toBeDefined();
                    expect(map.id).toEqual(90210);
                });

                it("should return an object with a list of CSV column names", function() {
                    expect(map.columns).toBeDefined();
                    expect(map.columns).toBeAnArray();
                    expect(map.columns).toContain('Allergies');
                });
            });
        });

    });
});
