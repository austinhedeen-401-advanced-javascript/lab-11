'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');

const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  role: { type: String, required: true, default: 'user', enum: ['admin', 'editor', 'user'] },
});

users.pre('save', function (next) {
  const SALT_ROUNDS = 10;
  return bcrypt.hash(this.password, SALT_ROUNDS)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch(error => { throw error; });
});

users.statics.authenticateBasic = function (auth) {
  const query = { username: auth.username };
  return this.findOne(query)
    .then(user => { return user ? user.comparePassword(auth.password) : null; })
    .catch(console.error);
};

users.methods.comparePassword = function (rawPassword) {
  return bcrypt.compare(rawPassword, this.password)
    .then(isPasswordValid => isPasswordValid ? this : null);
};

// Generate a JWT from the user id and a secret
users.methods.generateToken = function () {

  const tokenData = {
    id: this._id,
    capabilities: [],
  };

  return jsonWebToken.sign(tokenData, process.env.SECRET || 'E7#kSA6px&5bnF9$s!H@JZ^0TXTeXXOv67NXNM&IQyOjyJWX9W*6z0U6V01vARZWe6TMfZ0^#ECPZOcSdc*G4a8obStlV&#4tsy');
};

module.exports = mongoose.model('users', users);
