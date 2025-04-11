const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
 
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
 
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Blog', blogSchema);