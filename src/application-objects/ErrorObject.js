var ErrorObject = function (code, message) {
    this.code = code;
    this.message = message
};

ErrorObject.prototype = Object;
ErrorObject.constructor = ErrorObject;

module.exports = ErrorObject;