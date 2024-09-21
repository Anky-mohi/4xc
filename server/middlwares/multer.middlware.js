const multer = require("multer");
const crypto = require("crypto");
const unique = crypto.randomBytes(5).toString('hex');
// file upload
const storage = multer.diskStorage({
  destination: (request,fileInfo,callback)=>{
    callback(null,"storage/images");
  },
  filename: (request,fileInfo,callback)=>{
    callback(null,crypto.randomBytes(5).toString('hex')+".png");
  }
});


const multipart = multer({
  storage : storage
}).single("image");

module.exports = multipart;
