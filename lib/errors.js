import util from 'util';

export function AuthError(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'Authentication Error' || message;
  this.statusCode = 401;
}
util.inherits(AuthError, Error);

export function NotFoundError(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'Resource Not Found' || message;
  this.statusCode = 404;
}
util.inherits(NotFoundError, Error);
