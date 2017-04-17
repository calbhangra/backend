/**
 * Validations functions for models that return custom error messages
 * when the validation fails.
 *
 * Also a good place to define custom validations so they can be shared
 * across the models if need be.
 */
export const validations = {
  isDate: () => ({
    msg: 'must be a valid date',
  }),
  isBoolean: () => ({
    msg: 'must be a boolean',
  }),
  isEmail: () => ({
    msg: 'must be a valid email',
  }),
  isIP: () => ({
    msg: 'must be a valid IPv4 or IPv6 address',
  }),
  isIPv4: () => ({
    msg: 'must be a valid IPv4 address',
  }),
  isIPv6: () => ({
    msg: 'must be a valid IPv6 address',
  }),
  isInt: (opts = {}) => ({
    args: [opts],
    msg: 'must be an integer' + parseRange(opts),
  }),
  isFloat: (opts = {}) => ({
    args: [opts],
    msg: 'must be a decimal' + parseRange(opts),
  }),
  isIn: list => ({
    args: [list],
    msg: 'must be one of: ' + list.join(', '),
  }),
  isUUID: (version = 4) => ({
    args: [version],
    msg: 'must be a valid uuid',
  }),
};

/**
 * Helper function to parse an object contain min and/or max
 * keys into a user friendly validation message
 *
 * @param {Object} opts
 * @return {String}
 */
export function parseRange(opts) {

  const parts = [];

  if ('max' in opts) {
    parts.push(' less than ' + opts.max);
  }

  if ('min' in opts) {
    parts.push(' greater than ' + opts.min);
  }

  return parts.join(' and');
}

export default validations;
