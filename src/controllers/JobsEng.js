var express = require('express');
var bodyParser = require('body-parser');
var ResponseModel = require('../models/ResponseModel');
var ErrorModel = require('../models/ErrorModel');


var JobsEng = function (db) {
    this.DATABASE = db;
    this.router = express.Router();

    this._createDetailsRoute(this);
    this._createBuildShRoute(this);
    this._createSwaggerPyRoute(this);
    this._handleError(this);
};

JobsEng.constructor = JobsEng;

JobsEng.BUILD_SH_DB = 'build-sh-usages';
JobsEng.SWAGGER_PY = 'swagger-py-usages';

JobsEng.prototype = {

    getRouter: function () {
        return this.router;
    },

    _createDetailsRoute: function (self) {
        self.router.get('/jobs/eng/detail', function (req, res) {
            var countBuildShUsages = false;
            var countSwaggerPyUsages = false;

            var finish = function () {
                if(countBuildShUsages !== false && countSwaggerPyUsages !== false){
                    res.render('JobsEngDetail', { buildShUsages: countBuildShUsages, swaggerPyUsages: countSwaggerPyUsages });
                }
            };

            self.DATABASE.collection(JobsEng.BUILD_SH_DB).count(function (err, count) {
                if(self._handleDBError(err, res)) return;

                countBuildShUsages = count;

                finish();
            });

            self.DATABASE.collection(JobsEng.SWAGGER_PY).count(function (err, count) {
                if(self._handleDBError(err, res)) return;

                countSwaggerPyUsages = count;

                finish();
            });

        })
    },

    _createBuildShRoute: function (self) {
        self.router.put('/jobs/eng/build-sh', bodyParser.json(), function (req, res) {
            console.log(req.originalUrl, '. Request body: ', req.body);

            self.DATABASE.collection(JobsEng.BUILD_SH_DB).insertOne(req.body, function (err, result) {
                if(self._handleDBError(err, res)) return;

                console.log('---Saved to database', result.ops);
                res.send(new ResponseModel(ResponseModel.OK, result.insertedId));
            });
        });
    },

    _createSwaggerPyRoute: function (self) {
        self.router.put('/jobs/eng/swagger-py', bodyParser.json(), function (req, res) {
            console.log(req.originalUrl, '. Request body: ', req.body);

            self.DATABASE.collection(JobsEng.SWAGGER_PY).insertOne(req.body, function (err, result) {
                if(self._handleDBError(err, res)) return;

                console.log('---Saved to database', result.ops);
                res.send(new ResponseModel(ResponseModel.OK, result.insertedId));
            });
        });
    },

    _handleDBError: function (err, res) {
        if (err) {
            res.send(new ResponseModel(ResponseModel.ERR, new ErrorModel(1, 'Save error: ' + err.message)));
            return console.log(err);
        }
    },

    _handleError: function (self) {
        self.router.use(function (err, req, res, next) {
            console.error(req.originalUrl, err.stack);
            if (err.status === 400) {
                var response = new ResponseModel(ResponseModel.ERR, new ErrorModel(2, 'Bad Request: ' + err.message));
                res.send(response);
            } else {
                next();
            }
        });
    }
};

module.exports = JobsEng;