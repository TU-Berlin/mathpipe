"use strict";

var texString = require('./texstring');
var rp = require('request-promise');
var Promise = require('bluebird');
var join = Promise.join;
var fs = Promise.promisifyAll(require('fs'));

module.exports.check = function (tex, uri) {
    var options = {
        method: 'POST',
        uri: uri + 'check/tex',
        body: {
            q: tex
        },
        resolveWithFullResponse: true,
        json: true
    };
    return rp(options).then(function (respose) {
        if (respose.statusCode === 200) {
            return {
                checked: respose.body.checked,
                packages: respose.body.requiredPackages,
                hash: respose.headers['x-resource-location'],
                uri: uri
            };
        } else {
            throw new Error(respose.body);
        }
    });
};

var getFormatWriter = function (fmt, uri, hash, getFolder, fileName) {
    fileName = fileName || {
            svg: 'restbase.svg',
            mml: 'restbase.mml',
            png: 'restbase.png'
        }[fmt];
    var options = {
        uri: uri + 'render/' + fmt + '/' + hash,
        encoding: null
    };
    return join(rp(options), getFolder, function (content, folder) {
        return fs.writeFileAsync(folder.path + '/' + fileName, content);
    });
};

module.exports.getOutputs = function (getFolder, getCheck, formats) {
    formats = formats || ['svg', 'mml', 'png'];
    return getCheck.then(function (check) {
        var outputs = [];
        outputs.push(texString(
            getFolder,
            check.checked,
            check.packages,
            'checked', '% Generated from "' + check.uri + '" with hash: ' + check.hash));
        formats.forEach(function (fmt) {
            outputs.push(getFormatWriter(fmt, check.uri, check.hash, getFolder));
        });
        return outputs;
    });
};
