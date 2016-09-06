var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var schema = new Schema({
  html: {
    type: Number,
    required: false
  },
  css: {
    type: Number,
    required: false
  },
  js: {
    type: Number,
    required: false
  },
  sass: {
    type: Number,
    required: false
  },
  git: {
    type: Number,
    required: false
  },
  gulp: {
    type: Number,
    required: false
  },
  bower: {
    type: Number,
    required: false
  },
  php: {
    type: Number,
    required: false
  },
  nodejs: {
    type: Number,
    required: false
  },
  mongodb: {
    type: Number,
    required: false
  },
  created: {
    type: Date,
    default: Date.now
  }
});


exports.Diagram = mongoose.model('Diagram', schema);