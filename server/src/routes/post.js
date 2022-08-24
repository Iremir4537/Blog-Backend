const express = require("express");
const router = express.Router();
const Post = require("../models/post")
const ObjectId = require("mongodb").ObjectId
const User = require("../models/user");
const getUser = require("../middleware/getUser");
const {uploadImage,downloadImage} = require("../middleware/image")
const { Error } = require("mongoose");
const user = require("../models/user");


router.post("/api/post/post",[getUser,uploadImage] ,async (req,res) => {
    if(req.body.title == undefined && req.body.postHtml == undefined){
        res.status(201).json({
            message:"Please fill necessary parts"
        })
        return
    }
    try {
        const post = new Post({
            title: req.body.title,
            image: req.imgUrl,
            postHtml: req.body.postHtml,
            postedBy: req.user._id,
            postedByName:req.user.name,
            likeCount:0
        })
        await post.save();
        res.status(201).json({
            message:"Post has been created"
        })
    } catch (e) {
        res.status(500).json({
          message: "Something went wrong please try again",
        });
        return;
    }
})

router.get("/api/post/getall", async (req,res) => {
    try {
        const posts = await Post.find({})
        res.status(200).json({posts})
    } catch (e) {
        res.status(500).json({
          message: "Something went wrong please try again",
        });
        return;
    }
})

router.get("/api/post/getone/:id", async (req,res) => {
    try {
        if(req.params.id.length != 24 ){
            res.status(400).json({
              message: "The post you looking for is no longer exists",
            });
            return
        }
        const post = await Post.findById(req.params.id);
        if(post == null){
            res.status(400).json({
                message:"The post you looking for is no longer exists"
            })
            return
        }
        res.status(200).json(post)
    } catch (e) {
        res.status(500).json({
          message: "Something went wrong please try again",
        });
        return;
    }
})

router.get("/api/post/myposts", getUser,async (req,res) => {
    try {
        
        const myPosts = await Post.find({ postedBy:  req.user._id});
        res.send(myPosts)
    } catch (e) {
         res.status(500).json({
           message: "Something went wrong please try again",
         });
         return;
    }
})

router.put("/api/post/updatepost/:id", getUser, async (req,res) => {

try {
    const post = await Post.findById(req.params.id);
    if(post.postedBy.toString() == req.user._id.toString()){
        Post.findByIdAndUpdate(req.params.id,{title:req.body.title,image:req.body.image,postHtml:req.body.postHtml},function (err,result){
            if(err){
                throw new Error();
            }
            else{
                res.send(result)
            }
        })
    }
    else{
        throw new Error();
    }
} catch (e) {
    res.status(500).json({
      message: "Something went wrong please try again",
    });
    return;
}

})

router.delete("/api/post/deletepost/:id", getUser, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
       if (post.postedBy.toString() == req.user._id.toString()) {
         await Post.findByIdAndDelete(post._id);
         res.send("Deleted");
       } else {
         throw new Error();
       }
    } catch (e) {
        res.status(500).json({
          message: "Something went wrong please try again",
        });
        return;
    }
})

router.get("/api/post/getcomments/:id", async(req,res) => {
    try {
        const post =await Post.findById(req.params.id);
        await post.populate("comments");
        res.send(post.comments);
    } catch (e) {
        res.status(500).json({
          message: "Something went wrong please try again",
        });
        return;
    }
})

router.put("/api/post/like/:id", getUser, async (req,res) => {
    try {
        let userLikes = req.user.likes;
        const post = await Post.findById(req.params.id);
        const arr = userLikes.filter(id => id.postId.toString() == req.params.id.toString());
        if(arr.length>0){
            for (let i = 0; i < userLikes.length; i++) {
                if (userLikes[i] == arr[0] || userLikes[i] == arr) {    
                    userLikes.splice(i, 1);
                    await User.findByIdAndUpdate(req.user._id,{likes: userLikes})
                    post.likeCount =post.likeCount- 1;
                    await Post.findByIdAndUpdate(req.params.id,{likeCount:post.likeCount})
                }
            }
           res.status(200).json({
            message:"Like has been deleted"
           })
        }
        else{
            post.likeCount =post.likeCount + 1; 
            await Post.findByIdAndUpdate(req.params.id,{likeCount:post.likeCount})
            await User.findByIdAndUpdate(req.user._id,{$push: {likes: {postId:req.params.id}}})
            res.status(200).json({
              message: "Post has been liked",
            });
        }
        
    } catch (e) {
         res.status(500).json({
           message: "Something went wrong please try again",
         });
         return;
    }
})

module.exports = router;
