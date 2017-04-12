import _ from 'lodash';
import test from 'ava';
import Promise from 'bluebird';

import {User} from '../../models';
import utils from '../helpers/utils';
import router from '../../routes/user';

test.before(() => {
  return Promise.join(
    User.create({id: 214, email: 'u1@urouter.com', password: 'p'}),
    User.create({id: 345, email: 'u2@urouter.com', password: 'p'}),
  );
});

test.beforeEach(t => {
  t.context = utils.incitoAxios();
  t.context.app.use(router);
});

test.after.always(() => {
  return Promise.join(
    User.findOne({where: {email: 'u1@urouter.com'}}).call('destroy'),
    User.findOne({where: {email: 'u2@urouter.com'}}).call('destroy')
  );
});

test('GET /', async t => {

  const {request} = t.context;

  const res = await request.get('/');

  t.is(res.status, 200);
  t.true(Array.isArray(res.data));

  const body = _.keyBy(res.data, 'id');

  t.is(body[214].email, 'u1@urouter.com');
  t.is(body[345].email, 'u2@urouter.com');

});

test('POST /', async t => {

  const {request} = t.context;

  const res = await request.post('/', {
    email: 'post@urouter.com',
    password: 'banana',
  });

  t.is(res.status, 200);
  t.is(res.data.email, 'post@urouter.com');

});

test('GET /:id', async t => {

  const {request} = t.context;

  const res = await request.get('/214');

  t.is(res.status, 200);
  t.is(res.data.email, 'u1@urouter.com');

});

test('PUT /:id', async t => {

  const {request} = t.context;

  const res = await request.put('/214', {
    lastName: 'banana',
  });

  t.is(res.status, 200);
  t.is(res.data.email, 'u1@urouter.com');
  t.is(res.data.lastName, 'banana');

});

test('DELETE /:id', async t => {

  const user = await User.create({
    email: 'deleteme@urouter.com',
    password: 'p',
  });

  const {request} = t.context;

  const res = await request.delete(`/${user.id}`);

  t.is(res.status, 204);
  t.is(res.data, '');

});
