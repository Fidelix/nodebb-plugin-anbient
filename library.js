'use strict';

var helpers = require.main.require('./src/routes/helpers'),
  winston = require.main.require('winston'),
  user = require.main.require('./src/user'),
  topics = require.main.require('./src/topics'),
  async = require('async');

(function(library) {

  library.init = function(params, callback) {
    require('./websockets');
    require('./hooks');

    var middlewares = [params.middleware.checkGlobalPrivacySettings];
    helpers.setupPageRoute(params.router, '/users/email/:email', params.middleware, middlewares);

    callback();
  };

  library.initWriteRoutes = function(data, callback) {
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

    data.router.get('/users/email/:email', function(req, res) {
      var email = req.params.email;
      async.parallel({
        username: function (next) {
          user.getUsernameByEmail(email, next);
        },
        uid: function (next) {
          user.getUidByEmail(email, next);
        }
      }, function (err, results) {
        return data.errorHandler.handle(err, res, results);
      });
    });

    data.router.get('/topics/info/:tid', function(req, res) {
      var tid = req.params.tid;
      topics.getTopicField(tid, 'postcount', function(err, postCount){
        postCount = parseInt(postCount, 10) - 1;
        return data.errorHandler.handle(err, res, {postCount: postCount});
      });
    });

    winston.verbose('[plugins/anbient] Write API integration enabled, Anbient routes added.');
    callback(null, data);
  };

}(module.exports));
