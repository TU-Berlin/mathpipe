"use strict";
var texvc = require('../../lib/pipes/texvc.js');
var testcases = require('../files/hash.json');
var invalidTests = require('../files/invalid.json');
var pipe = require('../..');
var assert = require('assert');

describe('texvc', function () {
    testcases.forEach(function (tc) {
        it('should process ' + JSON.stringify(tc.input), function () {
           return texvc(pipe.getFolder(tc.input, pipe.config.conf.out_dir));
        });
    });
    invalidTests.forEach(function (tc) {
        it('should process invalid ' + JSON.stringify(tc.input), function () {
            return texvc(pipe.getFolder(tc.input, pipe.config.conf.out_dir)).catch(function(e){
                assert.equal(e.name,'Error');
                assert.ok(e.message.startsWith('texvc failed'));
            });
        });
    });
});