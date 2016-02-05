var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: 'User'},
  content: String,
  created: Date,
});

module.exports = mongoose.model('Post', PostSchema);
