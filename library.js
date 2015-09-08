'use strict';
/* globals module, require */

var Users = require.main.require('./src/user'),
  Messaging = require.main.require('./src/messaging'),
  apiMiddleware = require('./middleware'),
  errorHandler = require('../../lib/errorHandler'),
  auth = require('../../lib/auth'),
  utils = require('./utils');

var helpers = require('./helpers');
var setupPageRoute = helpers.setupPageRoute;

function getUsernameFromMail(){
  console.log('hello world');
}

module.exports = function(app, middleware) {
  app.get('/api/users/email/:email', getUsernameFromMail);

  //setupPageRoute(app, '/topic/:topic_id/:slug/:post_index?', middleware, [], controllers.topics.get);
  //setupPageRoute(app, '/topic/:topic_id/:slug?', middleware, [], controllers.topics.get);
};
