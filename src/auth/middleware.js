'use strict';

const User = require('./users-model.js');

module.exports = (req, res, next) => {

  try {
    try {
      let [type, authString] = request.headers.authorization.split(' ');
      if (type === 'basic') {
        return _authBasic(authString);
      } else {
        return _authError();
      }

    } catch (error) {
      return _authError();
    }

    function _authBasic() {
      const decodedString = Buffer.from(authString, 'base64').toString();
      const [username, password] = decodedString.split(':');
      const userSignIn = { username, password };
      return User.authenticateBasic(userSignIn)
        .then(user => _authenticate(user));
    }

    function _authenticate(user) {
      if (user) {
        request.user = user;
        request.token = user.generateToken();
        next();
      } else {
        return _authError();
      }
    }

    function _authError() {
      next({ status: 401, statusMessage: 'Unauthorized', message: 'Invalid User ID/Password' });
    }

  };

