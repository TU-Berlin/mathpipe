"use strict";

var fs = require('fs-bluebird');

module.exports = function (getFolder, name, content) {
    return getFolder.then(function (folder) {
        if (typeof name === "function"){
            name = name(folder);
        }
        if (typeof content === "function"){
            content = content(folder);
        }
        var fileName = folder.path + '/' + name ;
        return fs.writeFileAsync(fileName, content).return(fileName);
    });
};