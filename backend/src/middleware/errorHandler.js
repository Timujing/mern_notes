import { CustomApiError } from "../errors/custom-error.js";

const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof CustomApiError) {
        return res.status(err.statusCode).json({error: err.message});
    }

    return res.status(500).json({
        error: err.message || 'Internal Server Error'
    });
};

export default errorHandlerMiddleware;

