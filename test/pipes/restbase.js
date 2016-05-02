"use strict";
var restbase = require('../../lib/pipes/restbase.js');
var testcases = require('../files/hash.json');
var pipe = require('../..');

describe('restbase', function () {
    testcases.forEach(function (tc) {
        it('vaild sample ' + JSON.stringify(tc.input), function () {
            var getCheck = restbase.check(tc.input, 'https://en.wikipedia.org/api/rest_v1/media/math/');
            var getFoder = pipe.getFolder(tc.input, '/tmp');
            return restbase.getOutputs(getFoder, getCheck).all();
        });
    });
});