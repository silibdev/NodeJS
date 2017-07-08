var ErrorModel = function (code, message) {
    this.code = code;
    this.message = message
};

ErrorModel.prototype = Object;
ErrorModel.constructor = ErrorModel;

module.exports = ErrorModel;