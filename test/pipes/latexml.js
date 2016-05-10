"use strict";
var latexml = require('../../lib/pipes/latexml.js');
var testcases = require('../files/hash.json');
var invalidTests = require('../files/invalid.json');
var pipe = require('../..');
var assert = require('assert');

describe('latexml', function () {
    testcases.forEach(function (tc) {
        it('should process ' + JSON.stringify(tc.input), function () {
           return latexml(pipe.getFolder(tc.input, pipe.config.conf.out_dir));
        });
    });
    invalidTests.forEach(function (tc) {
        it('should process invalid ' + JSON.stringify(tc.input), function () {
            return latexml(pipe.getFolder(tc.input, pipe.config.conf.out_dir));
        });
    });
});