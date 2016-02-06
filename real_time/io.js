var async = require('async');
var Post = require('../models/post');
var User = require('../models/user');
var Room = require('../models/room');

module.exports = function(express, io) {

  io.on('connection', function(socket){
    var user = socket.request.user;


    User.findOne({ _id: user._id }, function(err, foundUser) {
      if (foundUser) {
        foundUser.socketId = socket.id;
        foundUser.online = "Online";
        foundUser.save(function(err) {
          console.log(user.username + " is " + foundUser.online);
        });
      }
    });

    socket.on('post', function(data) {
      if (data.length > 0) {
        var post = new Post();
        post.creator = socket.request.user._id;
        post.content = data;
        post.created = new Date();
        post.save(function(err, newPost) {
          if (err) throw err;
          socket.emit('post', {
            post: newPost,
            username: socket.request.user.username
          });

        });
      }

    });

    socket.on('friendAddOrDelete', function(data) {
      if (data) {
        socket.emit('friendAddOrDelete', data);
      }
    });
    socket.on('friendsRequest', function(data) {
      var userId = data.userId;
      async.waterfall([
        function(callback) {
          User.findOne({ _id: userId}, function(err, foundUser) {
            callback(err, foundUser);
          })
        },
        function(foundUser) {
          async.parallel([
            function(callback) {
              User.update(
                {
                  _id: userId,
                  'friendsRequestReceive.requestee': { $ne: user._id }
                },
                {
                  $push: {
                    friendsRequestReceive: { requestee: user._id } },
                }, function(err, count) {
                  io.to(foundUser.socketId).emit('friendsRequest',
                    user
                  );
                callback(err);
                console.log("Successful" + " from " + socket.request.user.username);

              });
            },
            function(callback) {
              User.update(
                {
                  _id: user._id,
                  'friendsRequestSend.friendTarget': { $ne: userId }
                },
                {
                  $push: {
                    friendsRequestSend: { friendTarget: userId } },
                }, function(err, count) {
                  callback(err);
              });
            }
          ])

        }
      ])
    });


    socket.on('chatTo', function(data) {
      async.parallel([
        function(callback) {
          User.findOne({_id: data.targetedUser}, function(err, foundUser) {
            // Send to other user, by searching his/her specific socket
            io.to(foundUser.socketId).emit('incomingChat', {
              sender: user.username, message: data.message, picture: user.picture
            });
            // Sending to himself
            socket.emit('incomingChat', {
              sender: user.username, message: data.message, picture: user.picture
            });
            callback(err);
          })
        },

        function(callback) {
          Room.findOne(
            { "users": { "$all": [ user._id, data.targetedUser ] }}
            , function (err, foundRoom) {
              console.log("Room already exist");
              if (foundRoom) {
                foundRoom.messages.push({
                  message: data.message,
                  creator: user._id,
                  date: new Date(),
                })
                foundRoom.save(function(err) {
                  callback(err);
                });
              } else {

                var room = new Room();
                room.users.push(user._id, data.targetedUser);
                room.messages.push({
                  message: data.message,
                  creator: user._id,
                  date: new Date(),
                });
                room.save(function(err) {
                  if (err) return next(err);
                  console.log('Room Created');
                  callback(err);
                });
              }
            });
          }
        ]);
      });

    //
    // socket.on('disconnect', function() {
    //   // echo globally that this client has left
    //  socket.broadcast.emit('user left', {
    //    username: socket.username,
    //    numUsers: numUsers
    //  });
    // });

  });


}
