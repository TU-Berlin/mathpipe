"use strict";
var webdriver = require('selenium-webdriver');
var path = require('path');
var pipe = require('..');
var file = require('../file');
var BB = require('bluebird');
var pre = '';
var post = '';

var newDrv = module.exports.getDriver = function () {
    return new BB(function (resolve) {
        resolve(new webdriver.Builder()
            .forBrowser('firefox')
            .build());
    });
};

var perpareHTML = module.exports.perpareHTML = function (input) {
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

};

function saveScreenshot(driver, dir, fileName) {
    return driver.takeScreenshot().then(function (data) {
        return file.save(dir, fileName, data.replace(/^data:image\/png;base64,/, ''), 'base64');
    });
}

module.exports.snapshot = function (getDriver, input, scale) {
    return BB.join(getDriver, perpareHTML(input), function (driver, path) {
        return driver.get(path.url)
            .then(function () {
                return driver.executeScript("document.body.style.MozTransformOrigin='0 0';" +
                    " document.body.style.transform='scale(" +
                    (scale || pipe.config.conf.firefox_scale) + ")';");
            })
            .then(function () {
                return driver.wait(webdriver.until.elementLocated(webdriver.By.xpath("//*[name()='math'|name()='svg']"))
                    , 1000);
            })
            .catch(function (e) {
                return driver.quit().then(function () {
                    driver = null;
                    throw e;
                });
            })
            .then(function () {
                console.log('found math taking screenshot');
                return saveScreenshot(driver, path.dir, path.destination);
            })
            .then(function () {
                return getDriver;
            });
    });
};
