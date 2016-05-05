"use strict";

var json = require('../package.json');
var crypto = require('crypto');
var mkdirp = require('mkdirp-bluebird');
var BB = require("bluebird");
var fs = require('fs');
var yaml = require('js-yaml');

module.exports = {
    name: json.name, // package name
    version: json.version // version # for this package
};

// set up the configuration
var config = {
    conf: yaml.safeLoad(fs.readFileSync(__dirname + '/../config.yaml'))
};

var texvc = require('./pipes/texvc.js');
var texstring = require('./pipes/texstring.js');
var restbase = require('./pipes/restbase.js');

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
    base = base || config.conf.out_dir;
    var jobs=[];
    file.forEach(function(element){
        var folder = getFolder(element.input,base);
        jobs.push(texvc(folder));
        jobs.push(texstring(folder));
        var getCheck = restbase.check(element.input, config.conf.restbase_url);
        jobs.push(restbase.getOutputs(folder, getCheck).all());
    });
   return BB.all(jobs).then(console.log('all done'));
};

module.exports.config = config;