var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    title: {
      type: String,
      required: true
    },
    tech: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    src: {
      type: String,
      required: true
    },
    created: {
      type: Date,
      default: Date.now
    }
});


exports.Work = mongoose.model('Work', schema);
