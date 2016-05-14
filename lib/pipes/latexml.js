"use strict";

var spawn = require('child-process-promise').spawn;
var path = require('path');
var pipe = require('../index.js');
var file = require('../file');

function getLaTeXML() {
    return path.resolve(__dirname + '/../../' + pipe.config.conf.latexml_path);
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
                return spawn(latexml, args,  {capture: ['stdout','stderr']}).then(function (o,e) {
                    console.log(JSON.stringify(o));
                    console.log(JSON.stringify(e));
                    return folder.path + '/latexml.mml';
                }).catch(function (e) {
                    console.error(JSON.stringify(e));
                });
            }, function () {
                return 'latexml not present';
            });
    });
};