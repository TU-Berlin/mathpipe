"use strict";
var firefox = require('../../lib/pipes/firefox.js');
var pipe = require('../..');
var path = require('path');

describe('firefox', function () {
    it('convert mml', function(){
        //var url = 'file://' + path.resolve(__dirname + '/../files/mj.html');
        this.timeout(50000);
        return firefox.snapshot(__dirname+'/../files/mj.mml');
    });
});