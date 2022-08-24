const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

mongoose.connect("mongodb://127.0.0.1:27017/blog", { useNewUrlParser: true });
