import util from 'util';

/**
 * A generic error constructor that intelligently handles the argument that is
 * passed in by assigning it to `message` property if its a string, `original`
 * if its an error or detail if its anything else.
 *
 * @class Class which all other errors should inherit from, also serves as
 * generic server error.
 * @param {*} arg - optional message, details or error to wrap
 */
export function ServerError(arg) {

  if (this.name === 'Error') {
    this.name = this.constructor.name;
  }

  this.message = this.message || 'Server Error';
  this.statusCode = this.statusCode || 500;

  if (typeof arg === 'string') {
    this.message = arg;
  } else if (arg instanceof Error) {
    this.original = arg;
  } else {
    this.detail = arg;
  }

  Error.captureStackTrace(this, this.constructor);
}
util.inherits(ServerError, Error);

/**
 * @class Client sent a malformed request of some kind.
 * @extends ServerError
 * @param {*} arg - optional message, details or error to wrap
 */
export function InvalidRequestError(arg) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'Invalid Request';
  this.statusCode = 400;
  ServerError.call(this, arg);
}
util.inherits(InvalidRequestError, ServerError);

/**
 * @class Client needs to (re)authenicate as no credentials were provided or the
 * provided credentials were invalid/expired.
 * @extends ServerError
 * @param {*} arg - optional message, details or error to wrap
 */
export function AuthError(arg) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'Authentication Error';
  this.statusCode = 401;
  ServerError.call(this, arg);
}
util.inherits(AuthError, ServerError);

/**
 * @class Client's credentials are valid, but user does not have permission to
 * make the request that was made.
 * @extends ServerError
 * @param {*} arg - optional message, details or error to wrap
 */
export function PermissionError(arg) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'Permission Error';
  this.statusCode = 403;
  ServerError.call(this, arg);
}
util.inherits(PermissionError, ServerError);

/**
 * @class Server was not able to locate the resource the client requested.
 * @extends ServerError
 * @param {*} arg - optional message, details or error to wrap
 */
export function NotFoundError(arg) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'Resource Not Found';
  this.statusCode = 404;
  ServerError.call(this, arg);
}
util.inherits(NotFoundError, ServerError);
