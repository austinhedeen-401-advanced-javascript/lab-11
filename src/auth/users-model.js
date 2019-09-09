'use strict';
/**
 * @module
 * @type {Mongoose}
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');

const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  role: { type: String, required: true, default: 'user', enum: ['admin', 'editor', 'user'] },
});

/**
 * Mongoose hook that hashes a user's password before saving to the database.
 */
users.pre('save', function (next) {
  const SALT_ROUNDS = 10;
  return bcrypt.hash(this.password, SALT_ROUNDS)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch(error => { throw error; });
});

/**
 * A static function on the Users model that looks up the user and verifies the given password.
 * @param {Object} auth - An object containing the user's username and password
 * @returns {Promise}
 */
users.statics.authenticateBasic = function (auth) {
  const query = { username: auth.username };
  return this.findOne(query)
    .then(user => { return user ? user.comparePassword(auth.password) : null; })
    .catch(console.error);
};

/**
 * An instance method on the Users model that compares a raw password with the hashed password in the database.
 * @param rawPassword
 * @returns {Promise}
 */
users.methods.comparePassword = function (rawPassword) {
  return bcrypt.compare(rawPassword, this.password)
    .then(isPasswordValid => isPasswordValid ? this : null);
};

/**
 * Generate a JWT from the user id and a secret.
 * @returns {string} The generated token
 */
users.methods.generateToken = function () {

  const tokenData = {
    id: this._id,
    capabilities: [],
  };

  return jsonWebToken.sign(tokenData, process.env.SECRET || 'changeit');
};

module.exports = mongoose.model('users', users);
