"use strict";
var assert = require('assert');
var pipe = require('../');
var testcases = require('./files/hash.json');

describe('Index', function () {
    testcases.forEach(function (tc) {
        it('should correctly process ' + JSON.stringify(tc), function () {
            assert.deepEqual(pipe.getHash(tc.input), tc.inputhash);
        });
    });
});