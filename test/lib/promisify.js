import test from 'ava';
import {noop} from 'lodash';
import Promise from 'bluebird';

import promisify from '../../lib/promisify';
import {NotFoundError} from '../../lib/errors';

test('passes all args to handler', t => {

  function handler(req, res, next) {
    t.is(req, 'req');
    t.true('json' in res);
    t.is(res.json, noop);
    t.is(next, noop);
    return Promise.resolve('resolve');
  }

  const middleware = promisify(handler);

  middleware('req', {json: noop}, noop);

});

test.cb('calls res.json with resolved value', t => {

  function handler() {
    return Promise.resolve('resolved');
  }

  const middleware = promisify(handler);

  function cb(arg) {
    t.is(arg, 'resolved');
    t.end();
  }

  middleware('req', {json: cb}, err => t.ifError(err));

});

test.cb('catches and passes errors to next', t => {

  function handler() {
    return Promise.reject(new TypeError('banana'));
  }

  const middleware = promisify(handler);

  function next(err) {
    t.true(err instanceof TypeError);
    t.is(err.message, 'banana');
    t.end();
  }

  middleware('req', {json: noop}, next);

});

test.cb('throws not found error if resolved with undef', t => {

  function handler() {
    return Promise.resolve();
  }

  const middleware = promisify(handler);

  function next(err) {
    t.true(err instanceof NotFoundError);
    t.end();
  }

  middleware('req', {json: noop}, next);

});

test.cb('throws not found error if resolved with null', t => {

  function handler() {
    return Promise.resolve(null);
  }

  const middleware = promisify(handler);

  function next(err) {
    t.true(err instanceof NotFoundError);
    t.end();
  }

  middleware('req', {json: noop}, next);

});
