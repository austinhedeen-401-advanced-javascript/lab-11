'use strict';
/**
 * @module
 */

/**
 * Middleware to handle 500 responses if the server experiences an error.
 * @param err - Error
 * @param req - Request object
 * @param res - Response object
 * @param next - Calls the next middleware function
 */
module.exports = (err, req, res, next) => {
  console.error('__SERVER_ERROR__', err);
  let error = { error: err.message || err };
  res.statusCode = err.status || 500;
  res.statusMessage = err.statusMessage || 'Server Error';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(error));
  res.end();
};
