var ResponseObject = function(status, data){
    this.status = status;
    this.data = data;
};

ResponseObject.constructor = ResponseObject;

ResponseObject.OK = 'OK';
ResponseObject.ERR = 'ERR';

module.exports = ResponseObject;