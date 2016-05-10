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
var firefox = require('./pipes/firefox.js');

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

var mkgroups = function (arr, n) {
    var result = [], group = [];
    var seen = Object.create(null);
    arr.forEach(function (elem) {
        if (seen[elem.input]) {
            return;
        } else {
            seen[elem.input] = true;
        }
        group.push(elem);
        if (group.length >= n) {
            result.push(group);
            group = [];
        }
    });
    if (group.length > 0) {
        result.push(group);
    }
    var duplicates = arr.length - Object.keys(seen).length;
    if (duplicates) {
        console.log(duplicates + " duplicates removed.");
    }
    return result;
};

module.exports.processFile = function (fName, base) {
    var file = require(fName);
    base = base || config.conf.out_dir;
    console.log('file contains "' + file.length + '" entries.');
    var grouped = mkgroups(file, config.conf.chunk_size);
    if (grouped.length > 1) {
        console.log('splitting into "' + grouped.length + '" groups.');
    }
    var i = 0;
    var start = new Date().getTime();
    // var j = 0;
    return BB.map(grouped, function (group) {
        var jobs = [];
        return BB.map(group, function (element) {
            var input;
            if (typeof element === 'string') {
                input = element;
            } else if (element.input) {
                input = element.input;
            } else {
                input = element[Object.keys(element)[0]];
            }
            var folder = getFolder(input, base);
            jobs.push(texvc(folder).catch(function (e) {
                console.log('texvc problem for ' + input + JSON.stringify(e));
            }));
            jobs.push(texstring(folder).then(function (res) {
                // console.log(JSON.stringify(res) + j++);
            }));
            var getCheck = restbase.check(input, config.conf.restbase_url);
            var getFormats = restbase.getOutputs(folder, getCheck);
            jobs.push(getFormats.all()
                .catch(function (e) {
                    console.log('restbase problem for ' + input + JSON.stringify(e));
                }));
            jobs.push(getFormats
                .then(function(res){
                    return res.get('mml').then(function (mml) {
                        return firefox.snapshot(mml);
                })}));
        }).then(function () {
            i++;
            return BB.all(jobs).then(function () {
                var now = new Date().getTime();
                console.log('block ' + i + ' finished. Duration: ' + (now - start) + 'ms.');
                start = now;
            });
        });
    }, {concurrency: 1}).then(function () {
        console.log('file read');
    });
};

module.exports.config = config;