const express = require("express");
const router = express.Router();
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  uploadBytes,
  ref,
  getDownloadURL,
} = require("firebase/storage");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const crypto = require("crypto");

const firebaseConfig = {
  apiKey: "AIzaSyDn7FElsSPg-ikrqsasLZQdSjJNOKz8OeQ",
  authDomain: "blog-cf723.firebaseapp.com",
  projectId: "blog-cf723",
  storageBucket: "blog-cf723.appspot.com",
  messagingSenderId: "353118927100",
  appId: "1:353118927100:web:066b59491674f5da22bf79",
};

const Firebaseapp = initializeApp(firebaseConfig);
const storage = getStorage();
const storageRef = ref(storage);

const uploadImage = async (req,res,next) => {

  if(req.files == null){
    next()  
    return ;
  }

    try {
        const fileType = req.files.file.mimetype;
        const arr = fileType.split("/");
        const type = arr[1];
        if (type != "png" && type != "jpg" && type != "jpeg") {
          res.send("Please upload proper file")
        }
        const imgName = crypto.randomBytes(8).toString("hex") + "." + type;
        const imageRef = ref(storage, `/images/${imgName}`);
        await uploadBytes(imageRef, req.files.file.data).then((snapshot) => {
          console.log("File Uploaded");
        });

        const ImgURL = await getDownloadURL(imageRef).then((url) => {
          const xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = (event) => {
            const blob = xhr.response;
          };
          xhr.open("GET", url);
          xhr.send();
          return url
        });
        
        req.imgUrl = ImgURL;
        next();
    } catch (e) {
        res.send("Something went wrong");
    }

}


const downloadImage = async (req,res,next) => {

    try {
        
        const imageRef = ref(storage, "/images/ " + req.body.imgName);
        getDownloadURL(imageRef).then((url) => {
          const xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = (event) => {
            const blob = xhr.response;
          };
          xhr.open("GET", url);
          xhr.send();
          req.imgUrl = url;
          next()
        });

    } catch (e) {
        res.send("Something went wrong")
    }

}

module.exports = {uploadImage,downloadImage}