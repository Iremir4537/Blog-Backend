const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

require("dotenv").config();

router.post("/api/user/create", async (req, res) => {
  if (
    req.body.password == null ||
    req.body.email == null ||
    req.body.name == null
  ) {
    res.json({
      message: "Please fill the necessery parts",
      error: true,
    });
    return;
  }

  //Minimum 3 letters long
  if (req.body.name.length < 3) {
    res.json({
      message: "Name must be at least 3 letters long",
      error: true,
    });
    return;
  }

  //Email must be valid
  if (!validator.isEmail(req.body.email)) {
    res.json({
      message: "Please enter a valid Email",
      error: true,
    });
    return;
  }
  //Email must not be in the database
  const x = await User.find({ email: req.body.email });
  if (x == []) {
    res.json({
      message: "Email is already in use",
      error: true,
    });
    return;
  }

  //Password minimum 7 letters long
  if (req.body.password.length < 7) {
    res.json({
      message: "Password must be at least 7 characters long",
      error: true,
    });
    return;
  }
  //Password must contain at least 1 upper and lower cased characters

  let hasLower;
  let hasUpper;
  let hasNumber;
  for (let i = 0; i < req.body.password.length; i++) {
    hasLower = false;
    hasUpper = false;
    hasNumber = false;
    if (req.body.password[i] == req.body.password[i].toUpperCase()) {
      hasUpper = true;
    }
    if (req.body.password[i] == req.body.password[i].toLowerCase()) {
      hasLower = true;
    }
    if (typeof parseInt(req.body.password[i], 10) == "number") {
      hasNumber = true;
    }
  }
  if (!hasLower || !hasNumber || !hasUpper) {
    res.json({
      message:
        "Password must contain numbers and 1 Lower 1 Upper case characters!",
      error: true,
    });
    return;
  }

  try {
    bcrypt.hash(req.body.password, 8, async (err, hash) => {
      try {
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        });
        await user.save();
        res.status(201).json({
          message: "Account is registered",
          error: false,
        });
      } catch (e) {
        res.status(500).json({
          message: "Something went wrong please try again",
          error: true,
        });
        return;
      }
    });
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong please try again",
      error: true,
    });
    return;
  }
});

router.post("/api/user/login", async (req,res) => {
    try {
       const  user = await User.findOne({email:req.body.email})
        if(user == null){
            res.status(400).json({
              message: "Email doesn't exist",
              error: true,
            });
            return
        }
        bcrypt.compare(req.body.password,user.password, function(err,result) {
           try {
                if(!result == true){
                    res.status(400).json({
                      message: "Password is incorrect",
                      error: true,
                    });
                    return
                }
                else{
                   const token = jwt.sign({name:user.name,email:user.email}, process.env.TOKENKEY);
                   res.cookie("SESSION", token, { expiresIn: "24h" });
                    res.status(200).json({
                      message: "Login is succesfull",
                      token,
                      error: false,
                    });
                    return
                }
           } catch (e) {
              res.status(500).json({
                message: "Something went wrong please try again",
                error: true,
              });
              return;
           }
        })
    } catch (e) {
      res.status(500).json({
        message: "Something went wrong please try again",
        error: true,
      });
      return;
    }
})

router.post("/api/user/logout", async (req,res) => {
  try {
    res.clearCookie("SESSION");
    res.status(200).json({
      message: "Successfully logged out",
      error: false,
    });
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong please try again",
      error: true,
    });
    return;
  }

})

router.get("/api/user/getposts/:id", async (req,res) => {
  try {
    const user = await User.findById(req.params.id);
    await user.populate("posts");
    res.status(200).json({
      posts: user.posts,
      error: false,
    });
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong please try again",
      error: true,
    });
    return;
  }
})

//User INFO

router.get("/api/user/info/:token", async (req,res) => {
  try {
        const userCredentials = jwt.verify(req.params.token, process.env.TOKENKEY);
        const user = await User.findOne({ email: userCredentials.email });
        if(!user){
          res.status(404).json({
            message:"User does not exist",
            erroe:true
          })
        }
        else{
          res.status(200).json({
            user,
            error:false
          })
        }

  } catch (e) {
    if(e.message == "jwt malformed"){
      res.json({
        message:"Wrong token",
        error:true,
      })
    }else{
      res.status(500).json({
        message: "Something went wrong please try again",
        error: true,
      });
      return;
    }
  }
})

module.exports = router;