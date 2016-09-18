import test from 'ava';
import * as errors from '../../lib/errors';

const types = [
  {error: 'InvalidRequestError', message: 'Invalid Request', statusCode: 400},
  {error: 'AuthError', message: 'Authentication Error', statusCode: 401},
  {error: 'PermissionError', message: 'Permission Error', statusCode: 403},
  {error: 'NotFoundError', message: 'Resource Not Found', statusCode: 404},
  {error: 'ServerError', message: 'Server Error', statusCode: 500},
];

types.forEach(function(type) {
  test(`${type.error} default constructor`, t => {
    const error = new errors[type.error]();

    t.is(error.name, type.error);
    t.is(error.message, type.message);

    if (error.statusCode) {
      t.is(error.statusCode, type.statusCode);
    }
  });

  test(`${type.error} message override`, t => {
    const error = new errors[type.error]('override');
    t.is(error.message, 'override');
  });

  test(`${type.error} wraps errors`, t => {
    const original = new SyntaxError('original error');
    const error = new errors[type.error](original);

    t.is(error.original, original);
    t.is(error.original.message, 'original error');
    t.is(error.message, type.message);
  });

  test(`${type.error} allows for detail object`, t => {
    const error = new errors[type.error]({detail: 'lots of details'});
    t.is(typeof error.detail, 'object');
    t.is(error.detail.detail, 'lots of details');
    t.is(error.message, type.message);
  });

  test(`${type.error} allows for detail array`, t => {
    const error = new errors[type.error]([0, 1]);
    t.true(Array.isArray(error.detail));
    t.is(error.detail[0], 0);
    t.is(error.detail[1], 1);
    t.is(error.message, type.message);
  });
});
