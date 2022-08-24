const express = require("express");
const router = express.Router();
const Comment = require("../models/comment")
const Post = require("../models/post");
const User = require("../models/user");
const getUser = require("../middleware/getUser");

router.post("/api/comment/post/:id", getUser, async (req,res) => {
    if(req.body.commentText == undefined && req.body.commentText == ""){
        res.json({
            message:"Comment can't be empty",
            error:true
        })
    }
    try {
        const userId =req.user._id;
        const comment = new Comment({commentText:req.body.commentText,commentedBy:userId,commentedByName:req.user.name,commentedPost:req.params.id})
        await comment.save()
        res.status(200).json({
          message: "Comment has been created",
          error: false,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
          message: "Something went wrong please try again",
          error: true,
        });
        return;
    }
})

router.delete("/api/comment/delete/:id", getUser, async (req,res) => {
    try {
        const userID = req.user._id;
        const comment = await Comment.findById(req.params.id);
        if(userID.toString() == comment.commentedBy.toString()){
            await Comment.findByIdAndDelete(comment._id);
            res.json({
              message: "Deleted",
              error: false,
            });
        }
        else{
            throw new Error();
        }
    } catch (e) {
        res.status(500).json({
          message: "Something went wrong please try again",
          error: true,
        });
        return;
    }
})

router.put("/api/comment/update/:id", getUser, async (req,res) => {
    try {
          const userID = req.user._id;
          const comment = await Comment.findById(req.params.id);
          if (userID.toString() == comment.commentedBy.toString()) {
            const newComment = await Comment.findByIdAndUpdate(comment._id,{commentText:req.body.commentText})
            res.json({newComment,error:false});
          } else {
            throw new Error();
          }
    } catch (e) {
        res.status(500).json({
          message: "Something went wrong please try again",
          error: true,
        });
        return;
    }
})

module.exports = router;