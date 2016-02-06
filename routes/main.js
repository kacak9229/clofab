var async = require('async');
var socketIo = require('../real_time/io')

var Post = require('../models/post');
var User = require('../models/user');
var Room = require('../models/room');


/* export the entire router */
module.exports = function(express, io) {

  var router = express.Router();
  /* There are two pathts, one is to go to a path where user has authenticated which is home.ejs
  The other route is a landing page if the user is not authenticated
  */
  router.get('/', function(req, res, next) {
    if (req.user) {
      Post.find({ creator: req.user._id }, function(err, posts) {
        if (err) return next(err);
        return res.render('main/home', { posts: posts });
      });
    } else {
      return res.render('main/landing');
    }
  });

  /* This is a search, for searching for people */
  router.post('/search', function(req, res, next) {
    res.redirect('/search?q=' + req.body.q);
  });

  router.get('/users/:id', function(req, res, next) {
    User.findOne({ _id: req.params.id }, function(err, foundUser) {
      res.render('main/single_user', { otherUser: foundUser});
    });
  });

  router.get('/message/:id', function(req, res, next) {
    async.waterfall([
      function(callback) {
        User.findOne({ _id: req.params.id }, function(err, foundUser) {
          callback(err, foundUser);
        });

      },
      function(foundUser) {
        Room
        .findOne({ "users": { "$all": [ req.user._id, foundUser._id ] }})
        .populate('messages.creator')
        .exec(function(err, foundRoom) {
          res.render('main/message2', { foundUser: foundUser, room: foundRoom });
        });
      }
    ]);

  });
  // Accept friend Request
  router.post('/accept-friend', function(req, res, next) {
    var userId = req.body.userId;
    async.parallel([
      // Minus Receive
      function(callback) {
        User.update({_id: req.user._id },
          {
            $pull: { friendsRequestReceive: { requestee: userId } },
            $push: { friends: { friend: userId } },
          }, function(err, count) {
            if (err) return next(err);
            callback(err, count);
          });
        },
        // Minus Send
        function(callback) {
          User.update({_id: userId },
            {
              $pull: { friendsRequestSend: { friendTarget: req.user._id } },
              $push: { friends: { friend: req.user._id } },
            }, function(err, count) {
              if (err) return next(err);
              callback(err, count);
            });
          },
          // add friend to req.user arrays.
          ], function(err, results) {
            var deleteReceive = results[0];
            var deleteSend = results[1];
            if (deleteReceive && deleteSend) {
              res.json('Added');
            }

          });
        });

        // Delete friend request
        router.post('/delete-friend-request', function(req, res, next) {
          var userId = req.body.userId;
          async.parallel([
            // Minus Receive
            function(callback) {
              User.update({_id: req.user._id },
                {
                  $pull: { friendsRequestReceive: { requestee: userId } },
                }, function(err, count) {
                  if (err) return next(err);
                  callback(err, count);
                });
              },
              // Minus Send
              function(callback) {
                User.update({_id: userId },
                  {
                    $pull: { friendsRequestSend: { friendTarget: req.user._id } },
                  }, function(err, count) {
                    if (err) return next(err);
                    callback(err, count);
                  });
                }
              ], function(err, results) {
                var deleteReceive = results[0];
                var deleteSend = results[1];

                if (deleteReceive && deleteSend) {
                  res.json('Deleted');
                }

              });
            });

            return router;

          }
