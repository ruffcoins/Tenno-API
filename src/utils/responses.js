
class Responses {
    static successResponse(success, result, extra, res) {
        if(extra == null){
            res.send({
                success,
                result
            });
        }else{
            res.send({
                success,
                result,
                token: extra,
            });
        }

    }

    static errorResponse(success, result, serverError, statusCode, res) {
        res.status(statusCode).send({
            success,
            result,
            server_error: serverError,
        });
    }
}

module.exports = {
    successResponse: Responses.successResponse,
    errorResponse: Responses.errorResponse,
};
