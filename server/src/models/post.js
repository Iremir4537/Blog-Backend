const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: {
    type: String,
    minLegth: 3,
    maxLength: 30,
    required: true,
  },
  image: {
    type: String
  },
  postHtml: {
    type: String,
    required: true,
    minLegth: 10,
  },
  postedBy: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  postedByName: {
    type:String,
    required:true,
  },
  likeCount:{
    type:Number
  }
},{timestamps:true});

postSchema.virtual("comments",{
  ref:"Comment",
  localField:"_id",
  foreignField:"commentedPost"
  
})

module.exports = mongoose.model("Post", postSchema);
