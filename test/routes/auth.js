import test from 'ava';

import {User} from '../../models';
import utils from '../helpers/utils';
import router from '../../routes/auth';

test.beforeEach(t => {
  t.context = utils.incitoAxios();
  t.context.app.use(router);
});

test.afterEach.always(t => {
  if (typeof t.context.cleanup === 'function') {
    return t.context.cleanup();
  }
});

test('/login', async t => {

  const user = await User.create({
    email: 'login@authrouter.com',
    password: 'password',
  });

  t.context.cleanup = () => user.destroy();

  const {request} = t.context;

  const res = await request.post('/login', {
    email: 'login@authrouter.com',
    password: 'password',
  });

  t.is(res.status, 200);
  t.true('token' in res.data);
  t.regex(res.data.token, utils.JWT_REGEX);

});

test('/signup', async t => {

  t.context.cleanup = () => {
    return User.findOne({where: {email: 's@authrouter.com'}}).call('destroy');
  };

  const {request} = t.context;

  const res = await request.post('/signup', {
    email: 's@authrouter.com',
    password: 'password',
  });

  t.is(res.status, 200);
  t.true('token' in res.data);
  t.regex(res.data.token, utils.JWT_REGEX);

});
