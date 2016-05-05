"use strict";
var assert = require('assert');
var pipe = require('../');
var testcases = require('./files/hash.json');
var invalidTests = require('./files/invalid.json');

describe('Index', function () {
    testcases.forEach(function (tc) {
        it('should calculate hash for ' + JSON.stringify(tc.input), function () {
            assert.deepEqual(pipe.getHash(tc.input), tc.inputhash);
        });
        it('should create dirs ' + JSON.stringify(tc.input), function () {
            return pipe.getFolder(tc.input, '/tmp').then(function (folder) {
                var f = folder.path;
                assert.equal(f.indexOf('/tmp/'), 0);
                assert.ok(f.indexOf(tc.inputhash) > 0);
                assert.ok(f.split('/').length > 4);
            });
        });
    });
    invalidTests.forEach(function (tc) {
        it('should calculate hash for ' + JSON.stringify(tc.input), function () {
            assert.deepEqual(pipe.getHash(tc.input), tc.inputhash);
        });
    });
    it('should process a file', function() {
        pipe.processFile('../test/files/hash.json');
    });
});