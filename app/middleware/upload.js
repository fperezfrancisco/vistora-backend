const multer = require("multer");
const storage = multer.memoryStorage(); // keep in memory for GCS upload
const upload = multer({ storage });

module.exports = upload;
