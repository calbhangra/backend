import jwt from 'jsonwebtoken';
import config from '../config';

export const decode = jwt.decode;
export const JsonWebTokenError = jwt.JsonWebTokenError;
export const TokenExpiredError = jwt.TokenExpiredError;

/**
 * The algorithm to use for generating the JWT signature. The key length must
 * match the length of the hash function used.
 *
 * @see https://tools.ietf.org/html/rfc4868#section-2.1.1
 * @see https://github.com/auth0/node-jsonwebtoken#algorithms-supported
 */
const ALGO = config.get('jwt.algorithm');
const SECRET = Buffer.from(config.get('jwt.secret'), 'base64');

const verifyDefaults = {
  alorithms: ['HS512'],
};

const options = {
  algorithm: ALGO,
  expiresIn: '6h',
  notBefore: 0,
};

/**
 * Creates a JWT
 *
 * @throws JsonWebTokenError
 *
 * @param {Object} body - the body of the JWT
 * @returns {String} the signed JWT
 */
export function create(body) {

  body = body || {};

  try {
    return jwt.sign(body, SECRET, options);
  } catch (caught) {
    const error = new JsonWebTokenError('Failed while signing JWT');
    Object.assign(error, caught, {name: 'JsonWebTokenError'});
    throw error;
  }
}


/**
 * Verifies if the JWT is valid and has not expired.
 * If its valid its returned otherwise an error is thrown
 *
 * @throws TokenExpiredError
 * @throws JsonWebTokenError
 *
 * @param {String} token - the JWT to be decoded
 * @param {Object} options - see docs for jsonwebtoken
 */
export function verify(token, options) {
  options = Object.assign({}, verifyDefaults, options);
  return jwt.verify(token, SECRET, options);
}

export default {create, verify, decode, JsonWebTokenError, TokenExpiredError};
