"use strict";
var texvc = require('../../lib/pipes/texvc.js');
var testcases = require('../files/hash.json');
var pipe = require('../..');

describe('texvc', function () {
    testcases.forEach(function (tc) {
        it('should calculate hash for ' + JSON.stringify(tc.input), function () {
           return texvc(pipe.getFolder(tc.input, '/tmp'));
        });
    });
});