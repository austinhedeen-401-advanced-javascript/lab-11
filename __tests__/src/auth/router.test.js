'use strict';

process.env.STORAGE = 'mongo';

const jwt = require('jsonwebtoken');

const server = require('../../../src/app.js').server;
const supergoose = require('../../supergoose.js');

const mockRequest = supergoose.server(server);

console.error = jest.fn();

let users = {
  admin: {username: 'admin', password: 'password', role: 'admin'},
  editor: {username: 'editor', password: 'password', role: 'editor'},
  user: {username: 'user', password: 'password', role: 'user'},
};

beforeAll(supergoose.startDB);
afterAll(supergoose.stopDB);

describe('Auth Router', () => {
  
  Object.keys(users).forEach( userType => {
    
    describe(`${userType} users`, () => {
      
      let encodedToken;
      let id;
      
      it('can create one', () => {
        return mockRequest.post('/signup')
          .send(users[userType])
          .then(results => {
            var token = jwt.verify(results.text, process.env.SECRET || 'changeit');
            id = token.id;
            encodedToken = results.text;
            expect(token.id).toBeDefined();
            expect(token.capabilities).toBeDefined();
          });
      });

      it('can signin with basic', () => {
        return mockRequest.post('/signin')
          .auth(users[userType].username, users[userType].password)
          .then(results => {
            var token = jwt.verify(results.text, process.env.SECRET || 'changeit');
            expect(token.id).toEqual(id);
            expect(token.capabilities).toBeDefined();
          });
      });

    });
    
  });
  
});

describe('Auth Router', () => {

  Object.keys(users).forEach( userType => {

    describe(`${userType} users`, () => {

      const errorObject = {
        "error": "Invalid User ID/Password"
      };

      let encodedToken;
      let id;

      it('cannot access /books route without authentication', () => {
        return mockRequest.get('/books')
          .then(results => {
            expect(results.status).toEqual(401);
            expect(results.body).toEqual(errorObject);
          });
      });

      it('can access /books route with basic authentication', () => {
        return mockRequest.get('/books')
          .auth(users[userType].username, users[userType].password)
          .then(results => {
            expect(results.status).toEqual(200);
            expect(results.body.count).toBeDefined();
          });
      });

      it('cannot access /books/:id route without authentication', () => {
        return mockRequest.get('/books/1')
          .then(results => {
            expect(results.status).toEqual(401);
            expect(results.body).toEqual(errorObject);
          });
      });

      it('can access /books/:id route with basic authentication', () => {
        return mockRequest.get('/books/1')
          .auth(users[userType].username, users[userType].password)
          .then(results => {
            expect(results.status).toEqual(200);
            expect(results.body.title).toBeDefined();
          });
      });

    });

  });

});