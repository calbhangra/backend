import _ from 'lodash';
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

/**
 * @param {Error} err
 * @return {TransformedError}
 */
export const transformers = {};

transformers.validation = function(err) {
  return {
    code: 400,
    message: 'Invalid Values',
    errors: err.errors.map(function(e) {
      if (e.type === 'notNull Violation') e.message = 'must not be null';
      return {field: e.path, reason: e.message};
    }),
  };
};

transformers.unique = function(err) {
  return {
    code: 409,
    message: 'Uniqueness Failure',
    errors: err.errors.map(function(e) {
      return {field: e.path, reason: 'must be unique'};
    }),
  };
};


transformers.constraint = function(err) {

  const detail = _.get(err, 'parent.detail', '');

  const field = detail.match(/Key \((.*?)\)/);
  const reason = detail.match(/in table "(.*?)"/);

  let errors;
  if (field && reason) {
    errors = [{
      field: field[1],
      reason: `must have a matching ${reason[1].replace(/s$/, '')}`,
    }];
  }

  return {
    errors,
    code: 409,
    message: 'Database Constraint Failure',
  };
};

transformers.database = function() {
  return {
    code: 400,
    message: 'Invalid values, verify if all data sent is of correct format',
  };
};

transformers.timeout = function() {
  return {
    code: 503,
    message: 'Server timeout, please try again in a few moments',
  };
};

transformers.generic = function(err) {

  const code = Number.isFinite(err.statusCode) ? err.statusCode : 500;

  let message = 'Unexpected error, please try again later';

  if (code !== 500) {
    message = err.message;
  }

  return {code, message};

};

/**
 * Transforms an error into a response body that can be sent to the client
 *
 * @param {Error} err - the caught error
 * @return {TransformedError} - the cleaned up error
 */
export function handler(err) {

  let transformer = transformers.generic;

  const name = err.name.replace(/(Sequelize|Error)/g, '');
  switch (name) {
    case 'Validation':
      transformer = transformers.validation;
      break;
    case 'UniqueConstraint':
      transformer = transformers.unique;
      break;
    case 'ForeignKeyConstraint':
    case 'ExclusionConstraint':
      transformer = transformers.constraint;
      break;
    case 'Timeout':
      transformer = transformers.timeout;
      break;
    case 'Database':
      transformer = transformers.database;
      break;
    default:
      // no-default
  }

  if (err instanceof Sequelize.ConnectionError) {
    // TODO replace this with an acutal logger
    /* eslint-disable no-console */
    console.error('ERROR: CANNOT CONNECT TO DATABAESE');
    console.error(err);
    /* eslint-enable no-console */
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

  // TODO replace this with an acutal logger
  console.error(err); // eslint-disable-line no-console

  res.status(body.code).json(body);

}

export default middleware;
