export class CustomError extends Error {
    constructor(statusCode, errorType, specificMessage) {
        super(specificMessage);
        this.statusCode = statusCode;
        this.errorType = errorType;
    }
}