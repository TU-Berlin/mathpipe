"use strict";
var assert = require('assert');
var pipe = require('../');
var testcases = [
    {input: '', options: '', out: ''},
    {
        input: 'This is a test',
        options: {},
        out: 'This is a test'
    }
];

describe('Index', function () {
    testcases.forEach(function (tc) {
        var input = tc.input;
        var options = tc.options;
        var output = tc.out;
        it('should correctly replace ' + JSON.stringify(input), function () {
            assert.deepEqual(pipe.mathpipe(input, options), output);
        });
    });
});