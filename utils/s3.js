require("dotenv").config();
const aws = require("aws-sdk");
const fs = require("fs");

const bucketName = process.env.S3_BUCKET;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (
  [bucketName, region, accessKeyId, secretAccessKey].some(
    (x) => x === undefined
  )
) {
  console.log("ENV variables improperly loaded");
  console.log("Bucket", bucketName);
  console.log("region", region);
  console.log("accessKey", accessKeyId);
  console.log("secret", secretAccessKey);
} else {
  console.log("ENV variables populated");
}

// create new instance of S3
const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// upload a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
    ContentType: "image/jpeg",
  };

  return s3.upload(uploadParams).promise();
}

// // download a file from s3
// export function getFileStream(filekey) {
//   const downloadParams = {
//     Key: filekey,
//     Bucket: bucketName,
//   };

//   return s3.getObject(downloadParams).createReadStream();
// }

module.exports = uploadFile;
