# LAB - 11

## Authentication

### Author: Austin Hedeen & Chance Harmon

### Links and Resources
* [submission PR](https://github.com/austinhedeen-401-advanced-javascript/lab-11/pull/4)
* [travis](https://travis-ci.com/austinhedeen-401-advanced-javascript/lab-11)
* [back-end](https://sleepy-plateau-50464.herokuapp.com/)

#### Documentation
* [jsdoc](https://sleepy-plateau-50464.herokuapp.com/docs)

### Modules
#### `app.js`
##### Exported Values and Methods

###### `server`
The Express application (for testing)

###### `start(port)`
Starts the Express server on `port`

### Setup
#### `.env` requirements
* `PORT` - Port Number
* `MONGODB_URI` - URL to the running mongo instance/db

#### Running the app
* `npm start`
* Endpoint: `/docs`
  * Renders Developer Documentation
  
#### Tests
* `npm test`

#### UML
![](assets/Lab%2011%20UML.jpg)
