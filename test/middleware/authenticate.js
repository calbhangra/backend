import _ from 'lodash';
import test from 'ava';
import sinon from 'sinon';

import jwt from '../../lib/jwt';
import {User} from '../../models';
import authenticate from '../../middleware/authenticate';
import {AuthError, InvalidRequestError} from '../../lib/errors';

const JWT_REGEX = /^[\w-]+?\.[\w-]+?\.[\w-]+?$/;

test.before(() => {
  return User.create({
    email: 'hello@pluto.com',
    password: 'moon',
  });
});

test.cb('jwt - throws error if Authorization header is not set', t => {

  authenticate.jwt({get: _.noop}, {}, arg => {
    t.true(arg instanceof InvalidRequestError);
    t.true(_.includes(arg.message, 'JWT'));
    t.true(_.includes(arg.message, 'Authorization'));
    t.end();
  });

});

test.cb('jwt - throws JWTError if token is invalid', t => {

  const req = {
    get: sinon.stub().withArgs('authorization').returns('venus'),
  };

  authenticate.jwt(req, {}, arg => {
    t.true(arg instanceof jwt.JsonWebTokenError);
    t.end();
  });

});

test.cb('jwt - sets properties on req', t => {

  const token = jwt.create({sub: 'jupiter', roles: ['giant']});

  const req = {
    get: sinon.stub().withArgs('authorization').returns(token),
  };

  authenticate.jwt(req, {}, () => {
    t.is(req.userId, 'jupiter');
    t.is(req.roles[0], 'giant');
    t.end();
  });

});

test('password - throws error if body/email/password are missing', t => {

  const stub = sinon.stub();

  authenticate.password({}, {}, stub);
  authenticate.password({body: ''}, {}, stub);
  authenticate.password({body: {email: true}}, {}, stub);
  authenticate.password({body: {password: true}}, {}, stub);

  t.is(stub.callCount, 4);
  stub.args.forEach(args => t.true(args[0] instanceof InvalidRequestError));

});

test.cb('password - throws AuthError if user is not found', t => {

  const body = {
    email: 'hello@mars.com',
    password: 'moon',
  };

  authenticate.password({body}, {}, arg => {
    t.true(arg instanceof AuthError);
    t.end();
  });

});

test.cb('password - throws AuthError if password is incorrect', t => {

  const body = {
    email: 'hello@pluto.com',
    password: 'planet',
  };

  authenticate.password({body}, {}, arg => {
    t.true(arg instanceof AuthError);
    t.end();
  });

});

test.cb('password - returns a json body with a JWT', t => {

  const body = {
    email: 'hello@pluto.com',
    password: 'moon',
  };

  const json = function(data) {
    t.truthy(data.token);
    t.true(JWT_REGEX.test(data.token));
    t.end();
  };

  authenticate.password({body}, {json});

});

test('createToken', t => {
  const token = authenticate.createToken({id: 10});
  t.true(JWT_REGEX.test(token));

  const payload = jwt.decode(token);
  t.is(payload.sub, 10);
});

