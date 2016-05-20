"use strict";

var spawn = require('child-process-promise').spawn;
var path = require('path');
var pipe = require('../index.js');
var file = require('../file');

function getLaTeXML() {
    return path.resolve(pipe.config.conf.latexml_path);
}

module.exports = function (getFolder, tex) {
    return getFolder.then(function (folder) {
        var args = [
            tex || folder.tex,
            '--preload',
            'texvc',
            '-pmml',
            folder.path + '/latexml.mml'
        ];
        var latexml = getLaTeXML();
        return file.exists(latexml)
            .then(function () {
                return spawn(latexml, args).then(function () {
                    return folder.path + '/latexml.mml';
                });
            }, function () {
                return 'latexml not present';
            });
    });
};