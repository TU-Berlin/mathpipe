"use strict";

var pipes = require('../');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

var preamble = "\\documentclass[12pt]{article}\n\\usepackage{texvc}\n\\pagestyle{empty}\n\\begin{document}\n$$\n";
var postable = "\n$$\n\\end{document}";

module.exports = function (tex, base) {
    return pipes.getFolder(tex, base).then(function (path) {
        return fs.writeFileAsync(path + '/' + 'out.tex', preamble + tex + postable);
    });
};