"use strict";

var fs = require('fs-bluebird');

module.exports.save = function (getFolder, name, content) {
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
        return fs.writeFileAsync(fileName, content).return(fileName);
    }
};

module.exports.rename = function(folder, oldName, newName){
    return fs.renameAsync(folder+'/'+oldName,folder + '/' + newName);
};

module.exports.exists = function(folder, oldName){
    return fs.existsAsync(folder+'/'+oldName);
};

