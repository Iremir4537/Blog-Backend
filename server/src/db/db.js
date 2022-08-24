const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
require("dotenv").config();

mongoose.connect(process.env.MONGODBURL, { useNewUrlParser: true });
