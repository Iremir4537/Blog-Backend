const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  commentText: {
    type: String,
    required: true,
    minLegth: 10,
    trim: true,
  },
  commentedBy: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  },
  commentedByName:{
    type: String
  },
  commentedPost: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  },
});

module.exports = mongoose.model("Comment", commentSchema);
