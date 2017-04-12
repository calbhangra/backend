import test from 'ava';
import Promise from 'bluebird';

import router from '../../routes';
import utils from '../helpers/utils';

test.beforeEach(t => {
  t.context = utils.incitoAxios();
  t.context.app.use(router);
});

test('home page', async t => {

  const {request} = t.context;

  const res = await request.get('/');

  t.is(res.status, 200);
  t.is(res.data, 'home page');

});

test('router mounting', t => {
  return t.notThrows(t.context.request.get('/user'));
});

test('404', async t => {

  const {request} = t.context;

  function check(err) {
    const res = err.response;
    return res.status === 404 && res.data === 'Not Found';
  }

  await Promise.join(
    await t.throws(request.post('/'), check),
    await t.throws(request.get('/asfasdfas'), check),
    await t.throws(request.options('/asdfdfr'), check)
  );

});
