"use strict";

var spawn = require('child-process-promise').spawn;
var path = require('path');
var pipe = require('../index.js');
var file = require('../file');
var BB = require("bluebird");

function getTexVc(){
    return path.resolve(__dirname + '/../../' + pipe.config.conf.texvc_path);
}

module.exports = function (getFolder, tex){
    return getFolder.then( function(folder) {
        var args = [
            folder.path,
            folder.path,
            tex||folder.tex,
            'UTF-8',
            'transparent',
            600
        ];
        return spawn( getTexVc(), args , { capture: [ 'stdout' ]} ).then(function(result){
            if ( result.stdout.match(/^[-FES]/) ){
                throw new Error('texvc failed: ' + result.stdout);
            }
            var outHash = result.stdout.substr(1,32);
            var outs = [ file.rename(folder.path,outHash+'.png','texvc.png').catch( function (e) {
                file.exists(folder.path,'texvc.png').then( function (){
                    console.log('Skip duplicate entry ' + args[2]);
                });
            }) ];
            var status = result.stdout.substr(0,1);
            var formats = { 'mml' : false ,'html': false};
            if ( status.match(/[CML]/)){
                var sep = result.stdout.indexOf("\x00");
                formats.html = result.stdout.substr(33,sep-33);
                formats.mml = result.stdout.substr(sep+1);
            } else if (status.match(/[cml]/)){
                formats.html = result.stdout.substr(33);
            } else if ('X'===status){ // not sure if that exists in practice
                formats.mml = result.stdout.substr(33);
            }
            for (var key in formats){
                if (formats[key]){
                    outs.push(file.save(folder.path,'texvc.'+key,formats[key]));
                }
            }
            var summary = {'hash':outHash,'status':status,'formats':formats};
            // console.log(JSON.stringify(summary,null,2));
            return BB.all(outs).return(summary);
        });
    });
};