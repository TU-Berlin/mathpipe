"use strict";

var file = require('../file');

var preambleFirst = "\\documentclass[12pt]{article}\n\\usepackage{ucs}\n\\usepackage[utf8]{inputenc}\n",
    preambleLast = "\n\\pagestyle{empty}\n\\begin{document}\n$$\n",
    preamblePackages = {
        texvc: "\\usepackage{texvc}\n",
        ams: "\\usepackage{amsmath}\n\\usepackage{amsfonts}\n\\usepackage{amssymb}\n",
        color: "\\usepackage[dvips,usenames]{color}\n",
        teubner: "\\usepackage[greek]{babel}\n\\usepackage{teubner}\n",
        euro: "\\usepackage{eurosym}\n",
        cancel: "\\usepackage{cancel}\n" // was always on in texvc 
    };

var getPreamble = function (packages, comment) {
    var preamble = preambleFirst;
    packages.forEach(function (p) {
        preamble += preamblePackages[p];
    });
    preamble += comment || '';
    return preamble + preambleLast;
};

var postamble = "\n$$\n\\end{document}";

module.exports = function (getFolder, tex, packages, name, comment) {
    function content (folder) {
        return getPreamble(packages || ['texvc'], comment) + (tex || folder.tex) + postamble;
    }
    return file(getFolder,(name || 'tex')+ '.tex', content);
};