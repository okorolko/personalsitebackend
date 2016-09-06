var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var schema = new Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});


exports.Blog = mongoose.model('Blog', schema);