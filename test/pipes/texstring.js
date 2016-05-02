"use strict";
var texstring = require('../../lib/pipes/texstring.js');
var testcases = require('../files/hash.json');

describe('tex', function () {
    testcases.forEach(function (tc) {
        it('should calculate hash for ' + JSON.stringify(tc.input), function () {
            return texstring(tc.input, '/tmp');
        });
    });
});