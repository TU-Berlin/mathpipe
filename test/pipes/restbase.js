"use strict";
var restbase = require('../../lib/pipes/restbase.js');
var validTests = require('../files/hash.json');
var invalidTests = require('../files/invalid.json');
var pipe = require('../..');
var assert = require('assert');
var BB = require('bluebird');

describe('restbase', function () {
    validTests.forEach(function (tc) {
        it('vaild sample ' + JSON.stringify(tc.input), function () {
            this.timeout(5000);
            var getCheck = restbase.check(tc.input, pipe.config.conf.restbase_url);
            var getFoder = pipe.getFolder(tc.input, pipe.config.conf.out_dir);
            return BB.map(restbase.getOutputs(getFoder, getCheck), function(format){
                return format[1].then( function (file){
                    assert.ok(file.indexOf(tc.inputhash)>0);
                });
            });
        });
    });
    invalidTests.forEach(function (tc) {
        it('invalid sample ' + JSON.stringify(tc.input), function () {
            this.timeout(5000);
            var getCheck = restbase.check(tc.input, pipe.config.conf.restbase_url);
            var getFoder = pipe.getFolder(tc.input, pipe.config.conf.out_dir);
            return restbase.getOutputs(getFoder, getCheck).all().catch(function(e){
                assert.equal(e.name,'StatusCodeError');
            });
        });
    });
});