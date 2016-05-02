"use strict";

var json = require('../package.json');
var crypto = require('crypto');

module.exports = {
    name: json.name, // package name
    version: json.version // version # for this package
};

module.exports.getHash = function ( tex ) {
    return crypto.createHash('md5').update(tex).digest('hex');
};
