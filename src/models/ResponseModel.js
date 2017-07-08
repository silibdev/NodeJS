var ResponseModel = function(status, data){
    this.status = status;
    this.data = data;
};

ResponseModel.constructor = ResponseModel;

ResponseModel.OK = 'OK';
ResponseModel.ERR = 'ERR';

module.exports = ResponseModel;