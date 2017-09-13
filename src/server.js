#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var mongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var f = require('util').format;
var JobsEng = require('./controllers/JobsEng');

/**
 *  Define the sample application.
 */
var SampleApp = function () {

    //  Scope.
    var self = this;

    var LOCALHOST = 'localhost:27017',
        MONGO_DB_HOST = process.env.OPENSHIFT_MONGODB_DB_URL || LOCALHOST,
        DB_NAME = process.env.OPENSHIFT_APP_NAME || 'nodejs',
        AUTH_MECHANISM = 'DEFAULT';


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function () {
        //  Set the environment variables we need.
        self.ipaddress = process.env.IP || process.env.NODEJS_SERVICE_HOST || process.env.OPENSHIFT_NODEJS_IP;
        self.port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        } else {
            console.log("The server is going to use this address", self.ipaddress + ':' + self.port);
        }
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function () {
        if (typeof self.zcache === "undefined") {
            self.zcache = {'index.html': ''};
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function (key) {
        return self.zcache[key];
    };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function (sig) {
        if (typeof sig === "string") {
            console.log('%s: Received %s - terminating sample app ...',
                new Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', new Date(Date.now()));
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function () {
        //  Process on exit and signals.
        process.on('exit', function () {
            self.terminator();
        });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function (element, index, array) {
            process.on(element, function () {
                self.terminator(element);
            });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function () {
        self.routes = {};

        self.routes['/'] = function (req, res) {
            console.log('%s: Received request for: "/". Serving: index.html',
                new Date(Date.now()));
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html'));
        };
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function () {
        var url;

        if (MONGO_DB_HOST === LOCALHOST) {
            url = f('mongodb://%s/%s', MONGO_DB_HOST, DB_NAME);
        } else {
            url = f('%s%s?authMechanism=%s',
                MONGO_DB_HOST, DB_NAME, AUTH_MECHANISM);
        }

        mongoClient.connect(url, function (err, database) {
            if (err) return console.log(err);

            var db = database;

            self.createRoutes();
            self.app = express();

            self.app.set('views', './src/views');
            self.app.set('view engine', 'pug');

            self.app.use('/', new JobsEng(db).getRouter());

            //  Add handlers for the app (from the routes).
            for (var r in self.routes) {
                self.app.get(r, self.routes[r]);
            }

            self.start();
        });
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function () {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function () {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function () {
            console.log('%s: Node server started on %s:%d ...',
                new Date(Date.now()), self.ipaddress, self.port);
        });
    };

};
/*  Sample Application.  */


/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
// zapp.start();

