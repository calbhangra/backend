import test from 'ava';
import sinon from 'sinon';
import Sequelize from 'sequelize';

import db from '../../lib/db';
import * as errors from '../../lib/errors';
import {handler, middleware} from '../../middleware/error_handler';

let MockModel;
test.before(() => {

  MockModel = db.define('MockModel', {
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: {
          msg: 'must be a valid email',
        },
        len: {
          args: [20, 200],
          msg: 'must be between 100 and 200 characters long',
        },
      },
    },
    notNull: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    unique: {
      type: Sequelize.STRING,
      unique: true,
    },
    short: {
      type: Sequelize.STRING(1),
    },
  });

  return MockModel.sync({force: true});

});

test.after.always(() => {
  db.modelManager.removeModel(MockModel);
});

test('Sequelize.ValidationError', async t => {

  const data = {email: 'adsfasf', notNull: '1'};
  const err = await MockModel.build(data).validate();
  const transformed = handler(err);

  t.is(transformed.code, 400);
  t.is(transformed.message, 'Invalid Values');
  t.is(transformed.errors[0].field, 'email');
  t.is(transformed.errors[0].reason, 'must be a valid email');

});

test('Sequelize.ValidationError - notNull', async t => {

  const data = {notNull: null};
  const err = await MockModel.build(data).validate();
  const transformed = handler(err);

  t.is(transformed.code, 400);
  t.is(transformed.message, 'Invalid Values');
  t.is(transformed.errors[0].field, 'notNull');
  t.is(transformed.errors[0].reason, 'must not be null');

});

test('Sequelize.UniqueConstraintError', async t => {

  const data = {unique: 'unique', notNull: 'yes'};
  const first = await MockModel.create(data);
  const err = await t.throws(MockModel.create(data));

  await first.destroy();

  const transformed = handler(err);

  t.is(transformed.code, 409);
  t.is(transformed.message, 'Uniqueness Failure');
  t.is(transformed.errors[0].field, 'unique');
  t.is(transformed.errors[0].reason, 'must be unique');

});

test.todo('Sequelize.ForeignKeyConstraintError');

test('Sequelize.DatabaseError', async t => {

  const data = {notNull: 'yes', short: '24'};
  const err = await t.throws(MockModel.create(data));
  const transformed = handler(err);

  t.is(transformed.code, 400);
  t.true(transformed.message.includes('verify if all data'));
  t.is(transformed.errors, undefined);

});

test('Sequelize.TimeoutError', t => {

  const err = new Sequelize.TimeoutError({});
  const transformed = handler(err);

  t.is(transformed.code, 503);
  // eslint-disable-next-line max-len
  t.is(transformed.message, 'Server timeout, please try again in a few moments');

});

test('Sequelize.ConnectionError', t => {

  const spy = sinon.spy(console, 'error');
  const err = new Sequelize.ConnectionError({});
  const transformed = handler(err);

  spy.restore();

  t.is(transformed.code, 500);
  t.is(transformed.message, 'Unexpected error, please try again later');
  t.is(spy.callCount, 2);

});

test('ServerError', t => {

  const spy = sinon.spy(console, 'error');
  const err = new errors.ServerError('lots of secret info');
  const transformed = handler(err);

  spy.restore();

  t.is(transformed.code, 500);
  t.is(transformed.message, 'Unexpected error, please try again later');
  t.is(spy.callCount, 0);

});

test('Error with status code other than 500', t => {

  const err = new errors.AuthError('incorrect credentials');
  const transformed = handler(err);

  t.is(transformed.code, 401);
  t.is(transformed.message, 'incorrect credentials');

});

test('middleware', t => {

  const err = new errors.ServerError();

  const res = {
    status: sinon.stub().callsFake(function(code) {
      t.is(code, 500);
      return this;
    }),
    json: sinon.stub().callsFake(function(transformed) {
      t.is(transformed.code, 500);
      t.is(transformed.message, 'Unexpected error, please try again later');
    }),
  };

  middleware(err, {}, res);

  t.is(res.status.callCount, 1);
  t.is(res.json.callCount, 1);

});
