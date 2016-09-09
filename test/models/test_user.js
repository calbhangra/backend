import _ from 'lodash';
import test from 'ava';
import {ValidationError} from 'sequelize';

import {User} from '../../models';

test.before(() => User.sync());

test('requires email', async t => {
  const error = await User.build({}).validate();

  t.true(error instanceof ValidationError);
  t.true(_.includes(error.message, 'email cannot be null'));
});

test('validates email', async t => {
  const user = {email: 'adsfasf'};
  const error = await User.build(user).validate();

  t.true(error instanceof ValidationError);
  t.true(_.includes(error.message, 'isEmail failed'));
});

test('requires password', async t => {
  const error = await User.build({}).validate();

  t.true(error instanceof ValidationError);
  t.true(_.includes(error.message, 'password cannot be null'));
});

test('succeeds', async t => {
  const data = {
    email: 'test@email.com',
    password: 'supersecure',
    firstName: 'joe',
    lastName: 'smith',
  };
  const error = await User.build(data).validate();

  t.is(error, null);
});

test('hashes password', async t => {
  const data = {
    email: 'test@email.com',
    password: 'supersecure',
  };

  const user = await User.build(data).save();
  t.not(user.get('password'), 'supersecure');
  return user.destroy();
});

test('on update: doesn\'t rehash password if its not modified', async t => {
  const data = {
    email: 'test@email.com',
    password: 'supersecure',
    firstName: 'joe',
  };

  const user = await User.build(data).save();
  const original = user.get('password');
  const updated = await user.update({firstName: 'bob'}).get('password');

  t.is(updated, original);
  return user.destroy();
});

test('on update: hashes password if it is modified', async t => {
  const data = {
    email: 'test@email.com',
    password: 'supersecure',
    firstName: 'joe',
  };

  const user = await User.build(data).save();
  const original = user.get('password');
  const updated = await user.update({password: 'password'}).get('password');
  t.not(updated, original);
  return user.destroy();
});
