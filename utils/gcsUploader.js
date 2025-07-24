const { Storage } = require("@google-cloud/storage");
const path = require("path");

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);

async function uploadToGCS(fileBuffer, filename, folder = "intake-uploads") {
  const destination = `${folder}/${Date.now()}_${filename}`;
  const file = bucket.file(destination);
  const stream = file.createWriteStream();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(`gs://${bucket.name}/${destination}`));
    stream.on("error", reject);
    stream.end(fileBuffer);
  });
}

module.exports = uploadToGCS;
