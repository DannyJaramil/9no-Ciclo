import { v2 as cloudinary } from "cloudinary";

require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = (stream, options) => {
  return new Promise((resolve, reject) => {
    const streamLoad = cloudinary.uploader.upload_stream(
      options,
      function (err, result) {
        if (err) {
          console.log("[err]", err);
          return reject(err);
        }
        return resolve(result);
      }
    );

    stream.pipe(streamLoad);
  });
};

module.exports = { cloudinary, cloudinaryUpload };
