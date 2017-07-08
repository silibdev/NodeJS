var express = require('express');
var bodyParser = require('body-parser');
var ResponseObject = require('../application-objects/ResponseObject');
var ErrorObject = require('../application-objects/ErrorObject');

var router = express.Router();
var DATABASE;

var BUILD_SH_DB = 'build-sh-usages';
var SWAGGER_PY = 'swagger-py-usages';

var LavoroEng = {

    getRouter: function (db) {
        DATABASE = db;
        this._createBuildShRoute();
        this._createSwaggerPyRoute();
        this._handleError();
        return router;
    },

    _createBuildShRoute: function () {
        router.put('/lavoro/eng/build-sh', bodyParser.json(), function (req, res) {
            console.log(req.originalUrl, '. Request body: ', req.body);

            DATABASE.collection(BUILD_SH_DB).insertOne(req.body, function (err, result) {
                if (err) {
                    res.send(new ResponseObject(ResponseObject.ERR, new ErrorObject(1, 'Save error: ' + err.message)));
                    return console.log(err);
                }

                console.log('---Saved to database', result.ops);
                res.send(new ResponseObject(ResponseObject.OK, result.insertedId));
            });
        });
    },

    _createSwaggerPyRoute: function () {
        router.put('/lavoro/eng/swagger-py', bodyParser.json(), function (req, res) {
            console.log(req.originalUrl, '. Request body: ', req.body);

            DATABASE.collection(SWAGGER_PY).insertOne(req.body, function (err, result) {
                if (err) {
                    res.send(new ResponseObject(ResponseObject.ERR, new ErrorObject(1, 'Save error: ' + err.message)));
                    return console.log(err);
                }

                console.log('---Saved to database', result.ops);
                res.send(new ResponseObject(ResponseObject.OK, result.insertedId));
            });
        });
    },

    _handleError: function () {
        router.use(function (err, req, res, next) {
            console.error(req.originalUrl, err.stack);
            if (err.status === 400) {
                var response = new ResponseObject(ResponseObject.ERR, new ErrorObject(2, 'Bad Request: ' + err.message));
                res.send(response);
            } else {
                next();
            }
        });
    }
};

module.exports = LavoroEng;