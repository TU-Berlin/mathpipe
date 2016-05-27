'use strict';


var BBPromise = require('bluebird');
var preq = require('preq');
var sUtil = require('../lib/util');

// shortcut
var HTTPError = sUtil.HTTPError;


/**
 * The main router object
 */
var router = sUtil.router();

/**
 * The main application object reported when this module is require()d
 */
var app;

function emitError(txt, detail) {
    if (detail === undefined) {
        detail = txt;
    }
    throw new HTTPError({
        status: 400,
        success: false,
        title: 'Bad Request',
        type: 'bad_request',
        detail: detail,
        error: txt
    });
}

/** ROUTE DECLARATIONS GO HERE **/

/**
 * POST /
 * Performs the rendering request
 */
router.post('/:outformat?/', function (req, res) {

    if (!(req.body.q)) {
        emitError("q (query) post parameter is missing!");
    }
});


module.exports = function(appObj) {

    app = appObj;

    return {
        path: '/',
        skip_domain: true,
        router: router
    };

};

