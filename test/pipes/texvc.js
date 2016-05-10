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
            return texvc(pipe.getFolder(tc.input, pipe.config.conf.out_dir))
                .then(function(){
                    assert.fail('then should not be called');
                })
                .catch(function(e){
                assert.equal(e.name,'Error');
                assert.ok(e.message.startsWith('texvc failed'));
            });
        });
    });
    it('should ignore duplicate requests ', function () {
        texvc(pipe.getFolder('\\sin x', pipe.config.conf.out_dir));
        texvc(pipe.getFolder('\\sin x', pipe.config.conf.out_dir));
        texvc(pipe.getFolder('\\sin x', pipe.config.conf.out_dir));
        return texvc(pipe.getFolder('\\sin x', pipe.config.conf.out_dir));
    });
    it('should not crash if texvc is not present ', function () {
        var tmp = pipe.config.conf.texvc_path;
        pipe.config.conf.texvc_path = 'invalid';
        return texvc(pipe.getFolder('\\sin x', pipe.config.conf.out_dir))
            .then(function (res) {
                assert.equal(res, 'texvc not present');
                pipe.config.conf.texvc_path = tmp;
            });
    });
});