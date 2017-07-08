var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var ResponseObject = require('../application-objects/ResponseObject');
var ErrorObject = require('../application-objects/ErrorObject');


var COLLECTION;
var COLLECTION_NAME = 'build-sh-usages';


router.put('/lavoro/eng/build-sh', bodyParser.json(), function (req, res) {
    console.log('Request body: ', req.body);

    COLLECTION.insertOne(req.body, function (err, result) {
        if (err) {
            res.send(new ResponseObject(ResponseObject.ERR, new ErrorObject(1, 'Save error: ' + err.message)));
            return console.log(err);
        }

        console.log('---Saved to database', result.ops);
        res.send(new ResponseObject(ResponseObject.OK, null));
    });
});


module.exports = function (database) {
    COLLECTION = database.collection(COLLECTION_NAME);
    return router;
};