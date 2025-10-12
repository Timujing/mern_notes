class CustomApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const createCustomApiError = (message, statusCode) => new CustomApiError(message, statusCode);
export {createCustomApiError as default, CustomApiError};