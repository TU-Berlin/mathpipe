"use strict";
var assert = require('assert');
var file = require('../lib/file');
var BB = require("bluebird");
var fs = BB.promisifyAll(require('fs'));

describe('File', function () {
    it('file /tmp should exist', function () {
        file.exists('/tmp').then(function (res) {
            assert.equal(typeof  res, 'object');
        });
    });
    it('file /notexists should not exist', function () {
        file.exists('/notexists').then(function () {
            assert.fail('file /notexists should not exist');
        }, function (res) {
            assert.equal(res.code, 'ENOENT');
        });
    });
});