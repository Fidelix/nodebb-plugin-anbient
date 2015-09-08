'use strict';

var controllers = require('./controllers'),
  helpers = require.main.require('./src/routes/helpers'),
  winston = require.main.require('winston'),
  friends = require('./friends');

var addRoutes = function(data, callback) {
  data.router.get('/awesome', apiMiddleware.requireUser, function(req, res) {
    console.log('lorem ipsum!');
    res.sendStatus(200);
  });

  callback(null, data);
});


(function(routes) {
  function getUserFromEmail(){
    winston.verbose('ZIBIRATO');
  };

  routes.init = function(params, callback) {
    var middlewares = [params.middleware.checkGlobalPrivacySettings];

    helpers.setupPageRoute(params.router, '/user/email/:email', params.middleware, middlewares, getUserFromEmail);

    callback();
  };

  routes.initWriteRoutes = function(data, callback) {
    var db = require.main.require('./src/database'),
      middleware = {
        verifyUserExists: function(req, res, next) {
          db.exists('user:' + req.params.uid, function(err, exists) {
            if (err) {
              return data.errorHandler.handle(err, res);
            } else if (!exists) {
              return data.errorHandler.respond(404, res);
            } else {
              return next();
            }
          });
        }
      };

    data.router.get('/user/email/:email', data.apiMiddleware.requireUser, data.apiMiddleware.requireAdmin, middleware.verifyUserExists, function(req, res) {
      console.log('Oh Shit!');
      friends.getFriendsPageData(req.params.uid, req.user.uid, 0, 49, function(err, friendsData) {
        return data.errorHandler.handle(err, res, friendsData);
      });
    });

    winston.verbose('[plugins/friends] Write API integration enabled, routes added.');
    callback(null, data);
  };

}(module.exports));
