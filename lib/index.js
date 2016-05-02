"use strict";

var json = require('../package.json');
var crypto = require('crypto');
var mkdirp = require('mkdirp');

module.exports = {
    name: json.name, // package name
    version: json.version // version # for this package
};

module.exports.getHash = function (tex) {
    return crypto.createHash('md5').update(tex).digest('hex');
};

module.exports.createFolder = function (hash, base, cb) {
    var folder = base + '/' + hash.split('',3).join('/')+'/'+hash;
    mkdirp(folder, function (err) {
        if (err){
            console.log( "Folder '" + folder + "' wasn't created." )
        } else {
            cb();
        }
    });
};
