var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var ResponseObject = require('../application-objects/ResponseObject');
var ErrorObject = require('../application-objects/ErrorObject');


var DATABASE;
var BUILD_SH_DB = 'build-sh-usages';
var SWAGGER_PY = 'swagger-py-usages';


router.put('/lavoro/eng/build-sh', bodyParser.json(), function (req, res) {
    console.log('Request body: ', req.body);

    DATABASE.collection(BUILD_SH_DB).insertOne(req.body, function (err, result) {
        if (err) {
            res.send(new ResponseObject(ResponseObject.ERR, new ErrorObject(1, 'Save error: ' + err.message)));
            return console.log(err);
        }

        console.log('---Saved to database', result.ops);
        res.send(new ResponseObject(ResponseObject.OK, result.insertedId));

    });
});

router.put('/lavoro/eng/swagger-py', bodyParser.json(), function (req, res) {
    console.log('Request body: ', req.body);

    DATABASE.collection(SWAGGER_PY).insertOne(req.body, function (err, result) {
        if (err) {
            res.send(new ResponseObject(ResponseObject.ERR, new ErrorObject(1, 'Save error: ' + err.message)));
            return console.log(err);
        }

        console.log('---Saved to database', result.ops);
        res.send(new ResponseObject(ResponseObject.OK, result.insertedId));
    });
});

router.use(function (err, req, res, next) {
    console.error(err.stack);
    if(err.status === 400){
        var response = new ResponseObject(ResponseObject.ERR, new ErrorObject(2, 'Bad Request: ' + err.message));
        res.send(response);
    } else {
        next();
    }
});

module.exports = function (database) {
    DATABASE = database;
    return router;
};