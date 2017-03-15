import test from 'ava';

import {PermissionError} from '../../lib/errors';
import {checker, middleware} from '../../middleware/permissions';

test('checker', t => {

  t.false(checker({role: 'user'}, ['blah', 'foo']));
  t.false(checker({role: 'user'}, ['user.list', 'foo']));
  t.false(checker({role: 'user'}, ['user.self', 'foo']));
  t.true(checker({role: 'admin'}, ['foo', 'user.get', 'foo']));

  t.false(checker({role: 'user'}, ['blah'], {blah: () => false}));
  t.true(checker({role: 'user'}, ['blah'], {blah: () => true}));

  const req = {
    id: 1,
    role: 'user',
    user: {id: 1},
  };

  const checkers = {
    blah: req => req.id === req.user.id,
  };

  t.true(checker(req, ['foo', 'blah'], checkers));

});


test('middleware', t => {

  t.plan(3);

  const warez = middleware(['user.get', 'user.self'], {
    'user.self': function(req) {
      return req.pass;
    },
  });

  warez({role: 'user'}, {}, err => {
    t.true(err instanceof PermissionError);
  });

  warez({role: 'admin'}, {}, err => {
    t.ifError(err);
  });

  warez({role: 'user', pass: true}, {}, err => {
    t.ifError(err);
  });


});
