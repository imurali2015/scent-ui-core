describe('core:', function() {

    'use strict';

    beforeEach(module('scent.core'));
    beforeEach(module('scent.test.common'));

    beforeEach(inject(function(scentTestService) {
        scentTestService.initCommon.call(this);
    }));

    describe('underscore/lodash', function() {

        it('should be injectable', inject(function(_) {
            expect(_).toBeTruthy();
        }));
    });

    describe('d3', function() {

        it('should be injectable', inject(function(d3) {
            expect(d3).toBeTruthy();
        }));
    });

    describe('authCode', function() {

        it('should be injectable', inject(function(authCode) {
            expect(authCode).toBeTruthy();
        }));
    });

    describe('baseUrl', function() {

        it('should be injectable', inject(function(baseUrl) {
            expect(baseUrl).toBeTruthy();
        }));
    });

    describe('keysFilter', function() {

        it('should exist', inject(function($filter) {
            expect($filter('keys')).toBeTruthy();
        }));

        it('should exist, really', inject(function(keysFilter) {
            expect(keysFilter).toBeTruthy();
        }));

        it('should handle undefined inputs', inject(function(keysFilter) {
            expect(keysFilter()).toBeAnArray();
            expect(keysFilter()).toEqual([]);
        }));

        it('should handle null inputs', inject(function(keysFilter) {
            expect(keysFilter(null)).toBeAnArray();
            expect(keysFilter(null)).toEqual([]);
        }));

        it('should handle empty inputs', inject(function(keysFilter) {
            expect(keysFilter({})).toBeAnArray();
            expect(keysFilter({})).toEqual([]);
        }));

        it('should handle normal inputs', inject(function(keysFilter) {

            var obj = { cheese: 1, onions: 2 };

            expect(keysFilter(obj)).toBeAnArray();
            expect(keysFilter(obj)).toEqual(['cheese', 'onions']);
        }));

        it('should ignore inputs with undefined values', inject(function(keysFilter) {

            var obj = { 'Student ID': undefined, 'Allergies': 2 };

            expect(keysFilter(obj)).toBeAnArray();
            expect(keysFilter(obj)).toEqual(['Allergies']);
        }));

        it('should ignore inputs with null values', inject(function(keysFilter) {

            var obj = { 'Student ID': null, 'Allergies': 2 };

            expect(keysFilter(obj)).toBeAnArray();
            expect(keysFilter(obj)).toEqual(['Allergies']);
        }));
    });

    describe('countkeysFilter', function() {

        it('should exist', inject(function($filter) {
            expect($filter('countkeys')).toBeTruthy();
        }));

        it('should exist, really', inject(function(countkeysFilter) {
            expect(countkeysFilter).toBeTruthy();
        }));

        it('should handle undefined inputs', inject(function(countkeysFilter) {
            expect(countkeysFilter()).toBeANumber();
            expect(countkeysFilter()).toEqual(0);
        }));

        it('should handle null inputs', inject(function(countkeysFilter) {
            expect(countkeysFilter(null)).toBeANumber();
            expect(countkeysFilter(null)).toEqual(0);
        }));

        it('should handle empty inputs', inject(function(countkeysFilter) {
            expect(countkeysFilter({})).toBeANumber();
            expect(countkeysFilter({})).toEqual(0);
        }));

        it('should handle normal inputs', inject(function(countkeysFilter) {

            var obj = { cheese: 1, bagels: 2 };

            expect(countkeysFilter(obj)).toBeANumber();
            expect(countkeysFilter(obj)).toEqual(2);
        }));

        it('should ignore inputs with undefined values', inject(function(countkeysFilter) {

            var obj = { 'Student ID': undefined, 'Allergies': 2 };

            expect(countkeysFilter(obj)).toBeANumber();
            expect(countkeysFilter(obj)).toEqual(1);
        }));

        it('should ignore inputs with null values', inject(function(countkeysFilter) {

            var obj = { 'Student ID': null, 'Allergies': 2 };

            expect(countkeysFilter(obj)).toBeANumber();
            expect(countkeysFilter(obj)).toEqual(1);
        }));
    });

    describe('capitalizeFilter', function() {

        it('should exist', inject(function($filter) {
            expect($filter('capitalize')).toBeTruthy();
        }));

        it('should exist, really', inject(function(capitalizeFilter) {
            expect(capitalizeFilter).toBeTruthy();
        }));

        it('should handle undefined', inject(function(capitalizeFilter) {
            expect(capitalizeFilter()).toBeAString();
            expect(capitalizeFilter()).toEqual('');
        }));

        it('should handle null', inject(function(capitalizeFilter) {
            expect(capitalizeFilter(null)).toBeAString();
            expect(capitalizeFilter(null)).toEqual('');
        }));

        it('should handle non-strings', inject(function(capitalizeFilter) {
            expect(capitalizeFilter({})).toBeAString();
            expect(capitalizeFilter({})).toEqual('');
        }));

        it('should handle empty strings', inject(function(capitalizeFilter) {
            expect(capitalizeFilter('')).toBeAString();
            expect(capitalizeFilter('')).toEqual('');
        }));

        it('should handle normal strings', inject(function(capitalizeFilter) {
            expect(capitalizeFilter('string')).toBeAString();
            expect(capitalizeFilter('string')).toEqual('String');
        }));

        it('should handle strings with non-alpha initial characters', inject(function(capitalizeFilter) {
            expect(capitalizeFilter('[string]')).toBeAString();
            expect(capitalizeFilter('[string]')).toEqual('[string]');
        }));
    });
});
