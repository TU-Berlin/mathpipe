"use strict";
var restbase = require('../../lib/pipes/restbase.js');
var validTests = require('../files/hash.json');
var invalidTests = require('../files/invalid.json');
var pipe = require('../..');
var assert = require('assert');

describe('restbase', function () {
    validTests.forEach(function (tc) {
        it('vaild sample ' + JSON.stringify(tc.input), function () {
            var getCheck = restbase.check(tc.input, 'https://en.wikipedia.org/api/rest_v1/media/math/');
            var getFoder = pipe.getFolder(tc.input, '/tmp');
            return restbase.getOutputs(getFoder, getCheck).all();
        });
    });
    invalidTests.forEach(function (tc) {
        it('invalid sample ' + JSON.stringify(tc.input), function () {
            var getCheck = restbase.check(tc.input, 'https://en.wikipedia.org/api/rest_v1/media/math/');
            var getFoder = pipe.getFolder(tc.input, '/tmp');
            return restbase.getOutputs(getFoder, getCheck).all().catch(function(e){
                assert.equal(e.name,'StatusCodeError');
            });
        });
    });
});