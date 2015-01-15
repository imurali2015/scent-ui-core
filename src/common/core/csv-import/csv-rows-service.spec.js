(function (angular, undefined) {

    'use strict';

    var rows = {
            "id"        : 90210,
            "filename"  : "nyc_students.csv",
            "columns"   : ["Grade", "SIS ID", "Given Name", "Family Name", "M.I.", "Allergies", "Email address"],
            "rows"   : {
                "1" :  ["K", "001", "John", "Gilmore", "", "", "jgilmore@saturn.edu"],
                "2" :  ["1", "002", "Marshall", "Allen", "", "Peanut", "mallen@saturn.edu"],
                "3" :  ["K", "004", "Pat", "Patrick", "", "", "ppatrick@saturn.edu"]
            }
        };


    angular.module('scent.test.core.csv-rows', [])
           .constant('fakeRows', rows);

})(window.angular);



describe('Service:', function() {

    'use strict';

    beforeEach(module('scent.core.csv-rows'));

    beforeEach(module('scent.test.common'));
    beforeEach(module('scent.test.core.csv-rows'));

    beforeEach(inject(function(scentTestService) {
        scentTestService.initCommon.call(this);
    }));


    describe('scent.core.csv-rows', function () {

        describe('csvRowsService', function () {

            it('should exist', inject(function (csvRowsService) {
                expect(csvRowsService).toBeDefined();
            }));


            it('should issue a GET request when queried', inject(function (csvRowsService, $httpBackend, baseUrl, fakeRows) {

                $httpBackend.expectGET(baseUrl + '/csvImports/90210/rows')
                            .respond(fakeRows);

                var rows = csvRowsService.query({ processId : 90210 });

                $httpBackend.flush();

                expect(rows).toBeDefined();
                expect(rows).toBeAnObject();
            }));

            describe('GET response', function () {

                var rows;

                beforeEach(inject(function (csvRowsService, $httpBackend, baseUrl, fakeRows) {

                    $httpBackend.expectGET(baseUrl + '/csvImports/90210/rows')
                                .respond(fakeRows);

                    rows = csvRowsService.query({ processId : 90210 });

                    $httpBackend.flush();
                }));

                it("should return an object with an id field", function() {
                    expect(rows.id).toBeDefined();
                    expect(rows.id).toEqual(90210);
                });

                it("should return an object with a list of CSV column names", function() {
                    expect(rows.columns).toBeDefined();
                    expect(rows.columns).toBeAnArray();
                    expect(rows.columns).toContain('Allergies');
                });
            });
        });

    });
});
