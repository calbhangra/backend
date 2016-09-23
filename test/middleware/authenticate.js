import test from 'ava';
import authenticate from '../../middleware/authenticate';
import {AuthError, InvalidRequestError} from '../../lib/errors';

// TODO install sinon and refactor these tests so they're cleaner

test('password fails when email or password is missing', t => {

  authenticate.password({body: ''}, {}, function(error) {
    t.true(error instanceof InvalidRequestError);
  });

  authenticate.password({body: {email: true}}, {}, function(error) {
    t.true(error instanceof InvalidRequestError);
  });

  authenticate.password({body: {password: true}}, {}, function(error) {
    t.true(error instanceof InvalidRequestError);
  });

});

test('password throws AuthError if user is not found', t => {

  authenticate.password({
    body: {
      email: 'hello@mars.com',
      password: 'moon',
    },
  }, {}, function(error) {
    t.true(error instanceof AuthError);
  });

});
