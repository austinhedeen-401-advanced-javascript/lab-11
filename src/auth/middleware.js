'use strict';
/**
 * @module
 */

const User = require('./users-model.js');

/**
 * A middleware function that authenticates a request using the request header
 * @param request
 * @param response
 * @param next
 * @returns {Promise|void}
 */
module.exports = (request, response, next) => {

  try {
    let [authType, authString] = request.headers.authorization.split(' ');
    if (authType.toLowerCase() === 'basic') {
      return _authBasic(authString);
    } else {
      return _authError();
    }

  } catch (error) {
    return _authError();
  }

  /**
   * Authenticates the request using basic auth
   * @param authString
   * @returns {Promise}
   * @private
   */
  function _authBasic(authString) {
    const decodedString = Buffer.from(authString, 'base64').toString();
    const [username, password] = decodedString.split(':');
    const userSignIn = { username, password };
    return User.authenticateBasic(userSignIn)
      .then(user => _authenticate(user));
  }

  /**
   * Completes the authentication process by placing a token in the request
   * @param user
   * @private
   */
  function _authenticate(user) {
    if (user) {
      request.user = user;
      request.token = user.generateToken();
      next();
    } else {
      return _authError();
    }
  }

  /**
   * If the authentication process hits an error, notify the client
   * @private
   */
  function _authError() {
    next({ status: 401, statusMessage: 'Unauthorized', message: 'Invalid User ID/Password' });
  }

};
