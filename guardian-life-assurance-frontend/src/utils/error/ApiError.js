import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError {
    constructor(specificMessage) {
        super(404, "Not Found", specificMessage || "The requested resource could not be found.");
    }
}

export class UnAuthorized extends CustomError {
    constructor(specificMessage) {
        super(401, "Unauthorized", specificMessage || "You are not authorized to access this resource.");
    }
}

export class ValidationError extends CustomError {
    constructor(specificMessage) {
        super(400, "Bad Request", specificMessage || "The request could not be understood or was missing required parameters.");
    }
}

export class AlreadyAssigned extends CustomError {
    constructor(specificMessage) {
        super(409, "Conflict", specificMessage || "The request could not be completed due to a conflict with the current state of the resource.");
    }
}

export class ForbiddenError extends CustomError {
    constructor(specificMessage) {
        super(403, "Forbidden", specificMessage || "You do not have permission to access this resource.");
    }
}

export class MethodNotAllowed extends CustomError {
    constructor(specificMessage) {
        super(405, "Method Not Allowed", specificMessage || "The method specified in the request is not allowed for the resource.");
    }
}

export class RequestTimeout extends CustomError {
    constructor(specificMessage) {
        super(408, "Request Timeout", specificMessage || "The server timed out waiting for the request.");
    }
}

export class InternalServerError extends CustomError {
    constructor(specificMessage) {
        super(500, "Internal Server Error", specificMessage || "An unexpected error occurred on the server.");
    }
}

export class ServiceUnavailableError extends CustomError {
    constructor(specificMessage) {
        super(503, "Service Unavailable", specificMessage || "The server is currently unable to handle the request due to a temporary overload or maintenance.");
    }
}
