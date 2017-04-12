import _ from 'lodash';
import test from 'ava';
import Promise from 'bluebird';

import {Gig} from '../../models';
import utils from '../helpers/utils';
import router from '../../routes/gig';

test.before(() => {
  return Promise.join(
    Gig.create({id: 214, contactEmail: 'g1@gigrouter.com'}),
    Gig.create({id: 345, contactEmail: 'g2@gigrouter.com'}),
  );
});

test.beforeEach(t => {
  t.context = utils.incitoAxios();
  t.context.app.use(router);
});

test.after.always(() => {
  return Promise.join(
    Gig.findOne({where: {contactEmail: 'g1@gigrouter.com'}}).call('destroy'),
    Gig.findOne({where: {contactEmail: 'g2@gigrouter.com'}}).call('destroy')
  );
});

test('GET /', async t => {

  const {request} = t.context;

  const res = await request.get('/');

  t.is(res.status, 200);
  t.true(Array.isArray(res.data));

  const body = _.keyBy(res.data, 'id');

  t.is(body[214].contactEmail, 'g1@gigrouter.com');
  t.is(body[345].contactEmail, 'g2@gigrouter.com');

});

test('POST /', async t => {

  const {request} = t.context;

  const res = await request.post('/', {
    contactEmail: 'post@gigrouter.com',
    accepted: true,
  });

  t.is(res.status, 200);
  t.is(res.data.contactEmail, 'post@gigrouter.com');

});

test('GET /:id', async t => {

  const {request} = t.context;

  const res = await request.get('/214');

  t.is(res.status, 200);
  t.is(res.data.contactEmail, 'g1@gigrouter.com');

});

test('PUT /:id', async t => {

  const {request} = t.context;

  const res = await request.put('/214', {
    compensation: 100,
  });

  t.is(res.status, 200);
  t.is(res.data.contactEmail, 'g1@gigrouter.com');

});

test('DELETE /:id', async t => {

  const gig = await Gig.create({
    contactEmail: 'deleteme@gigrouter.com',
  });

  const {request} = t.context;

  const res = await request.delete(`/${gig.id}`);

  t.is(res.status, 204);
  t.is(res.data, '');

});
