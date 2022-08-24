const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Names minimum lenth is 3"],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  likes: [{ postId: mongoose.SchemaTypes.ObjectId }],

},{timestamps:true});

//Virtual blog posts

userSchema.virtual("posts",{
  ref: "Post",
  localField: "_id",
  foreignField: "postedBy"
})

module.exports = mongoose.model("User", userSchema);
