"use strict";
var firefox = require('../../lib/pipes/firefox.js');

describe('firefox', function () {
    it('convert mml', function () {
        this.timeout(50000);
        return firefox.snapshot(firefox.getDriver(), __dirname + '/../files/mj.mml').then(function (driver) {
            driver.quit();
        });
    });
});
