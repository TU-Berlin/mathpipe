"use strict";
var screenshotPromise = require('screenshot-promise');
var file = require("../file");
var path = require('path');
var pipe = require('../..');
var pre = '';
var post = '';

function perpareHTML(input) {
    var dir = path.dirname(input);
    var fileName = path.basename(input);
    var destination = path.basename(input) + '.png';
    return file.read(input)
        .then(function (content) {
            content = pre + content + post;
            return file.save(dir, fileName + '.html', content);
        }).then(function () {
            return {
                url: 'file://' + path.resolve(dir + '/' + fileName + '.html'),
                destination: destination,
                dir: path.resolve(dir)
            };
        });
}

module.exports.snapshot = function (input, scale) {
    return perpareHTML(input)
        .then(function (path) {
            return screenshotPromise(path.url, '1024x768',
                {crop: true, scale: (scale || pipe.config.conf.firefox_scale)})
                .then(function (buf) {
                    return file.save(path.dir, path.destination, buf);
                });
        });
};