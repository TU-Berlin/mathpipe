"use strict";

var json = require('../package.json');
var crypto = require('crypto');
var mkdirp = require('mkdirp-bluebird');
var texvc = require('./pipes/texvc.js');
var restbase = require('./pipes/restbase.js');
var BB = require("bluebird");

module.exports = {
    name: json.name, // package name
    version: json.version // version # for this package
};

function path(hash, base) {
    return base + '/' + hash.split('', 3).join('/') + '/' + hash;
}

var getHash = module.exports.getHash = function (tex) {
    return crypto.createHash('md5').update(tex).digest('hex');
};

var getFolder = module.exports.getFolder = function (tex, base) {
    var p = path(getHash(tex), base);
    return mkdirp(p).return({path: p, tex: tex});
};

module.exports.processFile = function(fName, base ) {
    var file = require(fName);
    base = base || '/tmp';
    var jobs=[];
    file.forEach(function(element){
        var folder = getFolder(element.input,base);
        jobs.push(texvc(folder,base));
        var getCheck = restbase.check(element.input, 'http://api.formulasearchengine.com/en.wikipedia.org/v1/media/math/');
        jobs.push(restbase.getOutputs(folder, getCheck).all());
    });
   return BB.all(jobs).then(console.log('all done'));
};
