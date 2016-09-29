import _ from 'lodash';
import test from 'ava';
import sinon from 'sinon';

import jwt from '../../lib/jwt';
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

test.cb('jwt throws AuthError if token is not provided in auth header', t => {

  authenticate.jwt({get: _.noop}, {}, arg => {
    t.true(arg instanceof AuthError);
    t.true(_.includes(arg.message, 'JWT'));
    t.true(_.includes(arg.message, 'Authorization'));
    t.end();
  });

});

test.cb('jwt throws JWTError if token is invalid', t => {

  let req = {
    get: sinon.stub().withArgs('authorization').returns('venus'),
  };

  authenticate.jwt(req, {}, arg => {
    t.true(arg instanceof jwt.JsonWebTokenError);
    t.end();
  });

});

test.cb('jwt sets req.userId and req.roles', t => {

  const token = jwt.create({sub: 'jupiter', roles: ['giant']});
  let req = {
    get: sinon.stub().withArgs('authorization').returns(token),
  };


  authenticate.jwt(req, {}, () => {
    t.is(req.userId, 'jupiter');
    t.is(req.roles[0], 'giant');
    t.end();
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
