"use strict";

var json = require('../package.json');
var crypto = require('crypto');
var mkdirp = require('mkdirp-bluebird');

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

module.exports.getFolder = function (tex, base) {
    var p = path(getHash(tex), base);
    return mkdirp(p).return({path: p, tex: tex});
};
