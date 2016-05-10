"use strict";
var latexml = require('../../lib/pipes/latexml.js');
var testcases = require('../files/hash.json');
var invalidTests = require('../files/invalid.json');
var pipe = require('../..');
var assert = require('assert');

describe('latexml', function () {
    testcases.forEach(function (tc) {
        it('should process ' + JSON.stringify(tc.input), function () {
            var lt = latexml(pipe.getFolder(tc.input, pipe.config.conf.out_dir));
            return lt.then(function (res) {
                assert.ok(res.indexOf(tc.inputhash) > 0);
            });
        });
    });
    invalidTests.forEach(function (tc) {
        it('should process invalid ' + JSON.stringify(tc.input), function () {
            return latexml(pipe.getFolder(tc.input, pipe.config.conf.out_dir));
        });
    });
    invalidTests.forEach(function (tc) {
        it('should not crash if latexml is not present ', function () {
            var tmp = pipe.config.conf.latexml_path;
            pipe.config.conf.latexml_path = 'invalid';
            return latexml(pipe.getFolder(tc.input, pipe.config.conf.out_dir))
                .then(function (res) {
                    assert.equal(res, 'latexml not present');
                    pipe.config.conf.latexml_path = tmp;
                });
        });
    });
});