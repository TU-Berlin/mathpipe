"use strict";
var webdriver = require('selenium-webdriver');
var path = require('path');
var pipe = require('..');
var file = require('../file');
var pre = '';
var post = '';

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

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
webdriver.WebDriver.prototype.saveScreenshot = function (dir, fileName) {
    return driver.takeScreenshot().then(function (data) {
        return file.save(dir, fileName, data.replace(/^data:image\/png;base64,/, ''),'base64');
    });
};

module.exports.snapshot = function (input, scale) {
    return perpareHTML(input)
        .then(function (path) {
            driver.get(path.url);
            driver.executeScript("document.body.style.MozTransformOrigin='0 0'; document.body.style.transform='scale(" +
                (scale||pipe.config.conf.firefox_scale) +")';");
            return driver.saveScreenshot(path.dir, path.destination);
        });
};
