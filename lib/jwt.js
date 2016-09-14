import config from 'config';
import Promise from 'bluebird';
import jwt from 'jsonwebtoken';

const sign = Promise.promisify(jwt.sign);
const JsonWebTokenError = jwt.JsonWebTokenError;
const TokenExpiredError = jwt.TokenExpiredError;

/**
 * The algorithm to use for generating the JWT signature. The key length must
 * match the length of the hash function used.
 *
 * @see https://tools.ietf.org/html/rfc4868#section-2.1.1
 * @see https://github.com/auth0/node-jsonwebtoken#algorithms-supported
 */
const ALGO = config.get('jwt.algorithm');
const SECRET = Buffer.from(config.get('jwt.secret'), 'base64');

const options = {
  algorithm: ALGO,
};

/**
 * Creates a jwt given a token, appid and expiration
 *
 * @throws JsonWebTokenError
 * @param {Object} payload the main body of the jwt
 * @returns {String} the signed JWT
 */
const create = Promise.method(function(payload) {

  let body = {
    aud: 'https://app.calbhangra.com',
  };

  Object.assign(body, payload);

  return sign(body, SECRET, options)
    .catch(caught => {
      let error = new JsonWebTokenError();
      Object.assign(error, {name: 'JsonWebTokenError'}, caught);
      throw error;
    });
});


/**
 * Verifies if the jwt is valid and has not expired. if valid, it retuns the
 * decoded jwt
 *
 * @throws TokenExpiredError
 * @throws JsonWebTokenError
 * @param {String} token the jwt to be decoded
 * @param {Object} options see docs for jsonwebtoken
 */
const verify = Promise.method(function(token, options) {

  options = options || {};
  return jwt.verify(token, SECRET, options);

});

export default {create, verify, JsonWebTokenError, TokenExpiredError};
