import test from 'ava';
import sinon from 'sinon';

import {User} from '../../models';
import authenticate from '../../middleware/authenticate';
import {AuthError, InvalidRequestError} from '../../lib/errors';

const JWT_REGEX = /^[\w\-]+?\.[\w\-]+?\.[\w\-]+?$/;

test.before(() => {
  return User.create({
    email: 'hello@pluto.com',
    password: 'moon',
  });
});

test('password fails when email or password is missing', t => {

  let stub = sinon.stub();

  authenticate.password({body: ''}, {}, stub);
  authenticate.password({body: {email: true}}, {}, stub);
  authenticate.password({body: {password: true}}, {}, stub);

  t.is(stub.callCount, 3);
  stub.args.forEach(args => t.true(args[0] instanceof InvalidRequestError));
});

test.cb('password throws AuthError if user is not found', t => {

  let body = {
    email: 'hello@mars.com',
    password: 'moon',
  };

  authenticate.password({body}, {}, arg => {
    t.true(arg instanceof AuthError);
    t.end();
  });
});

test.cb("password throws AuthError if password's don't match", t => {

  let body = {
    email: 'hello@pluto.com',
    password: 'planet',
  };

  authenticate.password({body}, {}, arg => {
    t.true(arg instanceof AuthError);
    t.end();
  });
});

test.cb('password returns a JWT on success', t => {

  let body = {
    email: 'hello@pluto.com',
    password: 'moon',
  };

  let json = function(data) {
    t.truthy(data.token);
    t.true(JWT_REGEX.test(data.token));
    t.end();
  };

  authenticate.password({body}, {json});
});
