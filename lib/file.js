"use strict";
var BB = require("bluebird");
var fs = BB.promisifyAll(require('fs'));

module.exports.save = function (getFolder, name, content,encoding) {
    if (typeof getFolder === 'object'){
        return getFolder.then(function (folder) {
            if (typeof content === "function"){
                content = content(folder);
            }
            var fileName = folder.path + '/' + name ;
            return fs.writeFileAsync(fileName, content).return(fileName);
        });
    } else {
        var fileName = getFolder + '/' + name ;
        return fs.writeFileAsync(fileName, content, encoding||'utf8').return(fileName);
    }
};

module.exports.rename = function(folder, oldName, newName){
    return fs.renameAsync(folder+'/'+oldName,folder + '/' + newName);
};

module.exports.exists = function(folder, oldName){
    if (oldName){
        folder += '/' + oldName
    }
    return fs.statAsync(folder);
};

module.exports.read = function (filename){
    return fs.readFileAsync(filename);
};
