"use strict";
var screenshotPromise = require('screenshot-promise');
var file = require("../file");
var pipe = require('../..');
var firefox = require('./firefox');


module.exports.snapshot = function (input, scale) {
    return firefox.perpareHTML(input)
        .then(function (path) {
            return screenshotPromise(path.url, '1024x768',
                {crop: true, scale: (scale || pipe.config.conf.firefox_scale)})
                .then(function (buf) {
                    return file.save(path.dir, path.destination, buf);
                });
        });
};