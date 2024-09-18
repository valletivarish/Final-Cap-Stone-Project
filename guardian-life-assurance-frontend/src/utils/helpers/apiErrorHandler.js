import { NotFoundError, UnAuthorized, ValidationError, AlreadyAssigned, ForbiddenError, MethodNotAllowed, RequestTimeout, InternalServerError, ServiceUnavailableError } from '../error/ApiError';

export const handleApiError = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        throw new ValidationError(error.response.data.message);
      case 401:
        throw new UnAuthorized(error.response.data.message);
      case 403:
        throw new ForbiddenError(error.response.data.message);
      case 404:
        throw new NotFoundError(error.response.data.message);
      case 405:
        throw new MethodNotAllowed(error.response.data.message);
      case 408:
        throw new RequestTimeout(error.response.data.message);
      case 409:
        throw new AlreadyAssigned(error.response.data.message);
      case 500:
        throw new InternalServerError(error.response.data.message);
      case 503:
        throw new ServiceUnavailableError(error.response.data.message);
      default:
        throw new Error(error.response.data.message || "An unexpected error occurred.");
    }
  } else if (error.request) {

    throw new Error("No response received from the server. Please try again later.");
  } else {
    throw new Error(error.message || "An unexpected error occurred.");
  }
};
