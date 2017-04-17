import _ from 'lodash';
import test from 'ava';

import {parseRange, validations} from '../../models/validations';

/**
 * Macro that checks the return value of a validation
 *
 * @example
 * test(check, 'isIp');
 * test(check, 'isIn', true);
 */
function check(t, validation, checkArgs = false) {
  const obj = validations[validation]();

  const actual = Object.keys(obj).sort();
  const expected = ['msg'];

  if (checkArgs) {
    expected.unshift('args');
    t.true(Array.isArray(obj.args));
  }

  t.deepEqual(actual, Object.keys(obj));
}
check.title = function(title, validation, checkArgs) {
  const prefix = `${validation} should return an object containing a msg prop`;
  if (checkArgs) {
    return prefix + ' and an args prop pointing to an array';
  }
};

test('all validations are functions', t => {

  Object.keys(validations).forEach(function(name) {
    t.true(_.isFunction(validations[name]));
  });

});

test('parseRange', t => {
  const none = parseRange({});
  const min = parseRange({min: 0});
  const max = parseRange({max: 0});
  const both = parseRange({min: -3, max: 0});

  t.is(none, '');
  t.is(min, ' greater than 0');
  t.is(max, ' less than 0');
  t.is(both, ' less than 0 and greater than -3');
});

test(check, 'isDate');
test(check, 'isBoolean');
test(check, 'isEmail');
test(check, 'isIP');
test(check, 'isIPv4');
test(check, 'isIPv6');

test(check, 'isInt', true);
test('isInt', t => {
  const arg = {min: 1};

  const without = validations.isInt({});
  const withArg = validations.isInt(arg);

  t.deepEqual(without.args[0], {});
  t.is(withArg.args[0], arg);
});

test(check, 'isFloat', true);
test('isInt', t => {
  const arg = {min: 1};

  const without = validations.isInt({});
  const withArg = validations.isInt(arg);

  t.deepEqual(without.args[0], {});
  t.is(withArg.args[0], arg);
});

test('isIn', t => {
  const list = ['item1', 'item2'];
  const def = validations.isIn(list);

  t.is(def.msg, 'must be one of: item1, item2');
  t.deepEqual(def.args, [list]);
});

test(check, 'isUUID', true);
test('isUUID', t => {
  const simple = validations.isUUID();
  const v2 = validations.isUUID(2);

  t.is(simple.args[0], 4);
  t.is(v2.args[0], 2);
});
