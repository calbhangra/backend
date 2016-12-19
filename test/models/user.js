import _ from 'lodash';
import test from 'ava';
import {ValidationError} from 'sequelize';

import {User} from '../../models';

test.afterEach.always(t => {
  if (t.context.user) {
    return t.context.user.destroy();
  }
});

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

test('sets default role', async t => {
  const data = {
    email: 'test@default.com',
    password: 'test',
  };

  t.context.user = await User.create(data);

  const user = await User.find({where: {
    email: data.email,
  }});

  t.is(user.get('role'), 'user');
});

test('succeeds', async t => {
  const data = {
    email: 'test@all.com',
    password: 'supersecure',
    firstName: 'joe',
    lastName: 'smith',
    role: 'admin',
  };

  t.context.user = await t.notThrows(User.build(data).save());

  const user = await User.findOne({where: {
    email: data.email,
  }});

  t.not(user.password, data.password);
  t.is(user.firstName, data.firstName);
  t.is(user.lastName, data.lastName);
  t.is(user.role, data.role);
});

test('on update: doesn\'t rehash password if its not modified', async t => {
  const data = {
    email: 'test@nohash.com',
    password: 'supersecure',
    firstName: 'joe',
  };

  t.context.user = await User.build(data).save();
  const user = t.context.user;
  const original = user.get('password');
  const updated = await user.update({firstName: 'bob'}).get('password');

  t.is(updated, original);
});

test('on update: hashes password if it is modified', async t => {
  const data = {
    email: 'test@hash.com',
    password: 'supersecure',
    firstName: 'joe',
  };

  t.context.user = await User.build(data).save();
  const user = t.context.user;
  const original = user.get('password');
  const updated = await user.update({password: 'password'}).get('password');
  t.not(updated, original);
});
