var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  // email: { type: String, unique: true, lowercase: true},
  socketId: String,
  online: String,
  twitter: String,
  tokens: Array,
  username: String,
  displayName: String,
  picture: String,
  friends: [{
    friend: { type: Schema.Types.ObjectId, ref: 'User'},
  }],
  friendsCount: { type: Number, default: 0 },
  friendsRequestReceive: [{
    requestee: { type: Schema.Types.ObjectId, ref: 'User'},
  }],
  friendsRequestSend: [{
    friendTarget: { type: Schema.Types.ObjectId, ref: 'User' }
  }],

});


  module.exports = mongoose.model('User', UserSchema);
