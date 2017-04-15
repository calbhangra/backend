import Sequelize from 'sequelize';

/**
 * @type {Object}
 * @typedef TransformedError
 * @property {Number} code - http status code
 * @property {String} message - a short description of the error
 * @property {Object[]} [errors] - an optional array of error objects
 * @property {String} errors.field - the field that caused this error
 * @property {String} error.reason - why this error was thrown
 *
 * @example
 * {
 *   code: 500,
 *   message: 'something went wrong, please try again later',
 *   errors: [
 *     {
 *       field: 'password',
 *       reason: 'some reason'
 *     }
 *   ]
 * }
 */

export const transformers = {};

/**
 * Handles Sequelize's ValidationErrors
 *
 * @param {external:sequelize.ValidationError} err
 * @return {Object} {message, errors}
 */
transformers.validation = function(err) {

  return {
    code: 400,
    message: 'Invalid Values',
    errors: err.errors.map(function(e) {
      // TODO e.message should be cleaned up before being sent to client
      // e.type should be helpful for this
      return {field: e.path, reason: e.message};
    }),
  };

};

/**
 * Handles subclasses of Sequelize's DatabaseError which include
 *   - UniqueConstraintError
 *   - ExclusionConstraintError
 *   - ForeignKeyConstraintError
 *   - TimeoutError: query timeouts caused by deadlocks
 *
 * @param {external:sequelize.DatabaseError} err
 * @return {TransformedError}
 */
transformers.database = function(err) {

  // TODO these probably don't need their own transformer

  // TODO DatabaseError does not have errors, its stored in string
  // can be trigged by invalid uuid
  err.errors = err.errors || [];

  return {
    code: 409,
    message: 'Conflict',
    errors: err.errors.map(function(e) {
      // TODO e.message should be cleaned up before being sent to client
      // e.type should be helpful for this
      return {field: e.path, reason: e.message};
    }),
  };

};

/**
 * Handles errors that were not caught by any other transformer
 *
 * @param {Error} err
 * @return {TransformedError}
 */
transformers.generic = function(err) {

  const code = Number.isFinite(err.statusCode) ? err.statusCode : 500;
  const message = code === 500 ? 'Unexpected error, please try again later' : err.message;

  return {code, message};

};

/**
 * Transforms an error into an object containing a status code and a reponse
 * body
 *
 * @param {Error} err
 * @return {Object} {code: Number, body: TransformedError}
 */
export function handler(err) {

  let transformer = transformers.generic;

  if (err instanceof Sequelize.ValidationError) {
    transformer = transformers.validation;
  } else if (err instanceof Sequelize.DatabaseError) {
    transformer = transformers.database;
  }

  return transformer(err);

}

/**
 * Wraps the transformer into an express middleware
 * @implements {external:Express~ErrorHandler}
 */
// eslint-disable-next-line no-unused-vars
export function middleware(err, req, res, next) {

  const body = handler(err);

  if (req.log) {
    req.log.error(err);
  } else {
    console.error(err);
  }

  res.status(body.code).json(body);

}

export default middleware;
